//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import {
  Reentrance, reentrance, ObservableObject, unobservable, transaction, reaction
} from 'reactronic'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Linking, ToastAndroid } from 'react-native'
import { Modal } from './Modal'
import {
  PeerAgent, PeerAvailabilityStatus,
  PeerSearchStatus, PeersFoundResponse, PeersUpdatedResponse,
  ReceivedMessageResponse, SA, SAInitError, SAMessage, SAMessageEvents,
} from 'react-native-samsung-accessory'
import { App } from './App'
import DeviceInfo from 'react-native-device-info'

export class Accessory extends ObservableObject {
  @unobservable readonly helpModal: Modal

  accessoryServiceInstalled: boolean = false
  accessoryServiceInitialized: boolean = false
  searchingForPeers: boolean = false

  peers: PeerAgent[] = []
  selectedPeer?: PeerAgent = undefined
  selectedPeerAccessoryId?: string = undefined

  incomingMessage?: Message = undefined
  incomingMessagePeerId?: string = undefined

  constructor() {
    super()
    this.helpModal = new Modal()
    SAMessageEvents.addPeersFoundListener(this.onPeersFound)
    SAMessageEvents.addPeersUpdatedListener(this.onPeersUpdated)
    SAMessageEvents.addMessageListener(this.handleIncomingMessage)
  }

  @transaction
  openAccessoryServiceInGooglePlay(): void {
    void Linking.openURL('https://play.google.com/store/apps/details?id=com.samsung.accessory')
  }

  @reaction
  @reentrance(Reentrance.WaitAndRestart)
  protected async init(): Promise<void> {
    await this.loadSelectedPeerId()
    if (App.state === 'active') {
      if (!this.accessoryServiceInitialized)
        try {
          await SA.initialize()
          this.accessoryServiceInstalled = true
          this.accessoryServiceInitialized = true
        }
        catch (e) {
          if (e.code === SAInitError.LIBRARY_NOT_INSTALLED)
            this.accessoryServiceInstalled = false
          this.accessoryServiceInitialized = false
        }
    }
  }

  @reaction
  @reentrance(Reentrance.WaitAndRestart)
  protected async initSAMessage(): Promise<void> {
    if (this.accessoryServiceInitialized) {
      try {
        await SAMessage.initialize()
      } catch (e) {
        console.error(e)
        throw e
      }
      this.searchForPeers()
    }
  }

  @transaction
  searchForPeers(): void {
    if (!this.searchingForPeers)
      try {
        SAMessage.findPeers()
      } catch (e) {
        console.log(e)
      }
    this.searchingForPeers = true
  }

  @transaction
  private onPeersFound(response: PeersFoundResponse): void {
    console.log(PeerSearchStatus[response.status])
    console.log(response.peers)
    this.searchingForPeers = false
    if (response.status === PeerSearchStatus.PEER_AGENT_FOUND) {
      this.peers = response.peers.slice()
    }
    else if (response.status !== PeerSearchStatus.FINDPEER_DUPLICATE_REQUEST) {
      this.peers = []
    }
  }

  @transaction
  private onPeersUpdated(response: PeersUpdatedResponse): void {
    console.log(PeerAvailabilityStatus[response.status])
    console.log(response.peers)
    const peersMutable = this.peers.toMutable()
    if (response.status === PeerAvailabilityStatus.PEER_AGENT_AVAILABLE) {
      for (const peer of response.peers) {
        const i = this.peers.findIndex(x => x.peerId === peer.peerId)
        if (i >= 0)
          peersMutable[i] = peer
        else
          peersMutable.push(peer)
      }
    }
    else {
      for (const peer of response.peers) {
        const i = peersMutable.findIndex(x => x.peerId === peer.peerId)
        if (i >= 0)
          peersMutable.splice(i, 1)
      }
    }
    this.peers = peersMutable
  }

  @transaction
  private handleIncomingMessage(response: ReceivedMessageResponse): void {
    console.log(`⇓ Accessory peer ${response.peerId}`)
    console.log(response.message)
    const message = JSON.parse(response.message) as Message
    if (!message.type)
      console.warn('Unsupported accessory message format: no type provided')
    else {
      this.incomingMessage = message
      this.incomingMessagePeerId = response.peerId
    }
  }

  async sendMessage(peer: PeerAgent, message: Message): Promise<void> {
    const request = JSON.stringify(message)
    console.log(`⇑ Accessory peer ${peer.peerId}`)
    console.log(message)
    await SAMessage.sendMessage(peer.peerId, request)
  }

  @transaction
  selectPeer(peer: PeerAgent): void {
    this.selectedPeerAccessoryId = peer.accessory.accessoryId
  }

  @reaction
  protected async saveSelectedPeerId(): Promise<void> {
    if (this.selectedPeerAccessoryId)
      await AsyncStorage.setItem('selected-peer-accessory-id', this.selectedPeerAccessoryId)
  }

  @transaction
  private async loadSelectedPeerId(): Promise<void> {
    const selectedPeerAccessoryId = await AsyncStorage.getItem('selected-peer-accessory-id')
    if (selectedPeerAccessoryId)
      this.selectedPeerAccessoryId = selectedPeerAccessoryId
  }

  @reaction
  protected doSelectPeer(): void {
    if (this.selectedPeerAccessoryId) {
      const peer = this.peers.find(x => x.accessory.accessoryId === this.selectedPeerAccessoryId)
      this.selectedPeer = peer
    }
  }

  async authorize(peer: PeerAgent): Promise<void> {
    try {
      await this.sendMessage(peer, {
        type: 'auth',
        data: {
          token: App.user.stored.token,
          deviceId: DeviceInfo.getUniqueId(),
        },
      })
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.LONG)
      throw e
    }
  }
}

interface Message<T = unknown> {
  type: string
  data?: T
}
