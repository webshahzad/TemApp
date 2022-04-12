//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Bool } from 'common/constants'
import { ChatType, GroupChatStatus, RemoveMemberStatus, Visibility } from 'models/data/ChatRoom'
import { Alert, DrawerLayoutAndroid } from 'react-native'
import { Reentrance, reentrance, ObservableObject, unobservable, Transaction, transaction, reaction, standalone } from 'reactronic'
import { Api } from '../Api'
import { App } from '../App'
import { HoneyCombType } from '../ExtraHoneyCombs'
import { Firebase } from '../Firebase'
import { Chat } from './Chat'
import { GroupInfo } from './GroupInfo'

export class GroupChat extends ObservableObject {
  @unobservable private readonly chat: Chat
  @unobservable readonly drawer: ChatDrawer
  @unobservable readonly info: GroupInfo

  addedToDashboard: boolean = false

  constructor(chat: Chat) {
    super()
    this.drawer = new ChatDrawer()
    this.chat = chat
    this.info = new GroupInfo(chat)
  
  }

  @reaction
  protected async checkIsAddedToDashboard(): Promise<void> {
    if (this.chat.chatInfo.type === ChatType.GroupChat) {
      const response = await App.user.extraHoneyCombs.isAddedToDashboard(HoneyCombType.Tem, this.chat.roomId)
      this.addedToDashboard = response === Bool.True
    }
  }

  @transaction
  @reentrance(Reentrance.WaitAndRestart)
  async toggleMute(value: boolean): Promise<void> {
    const mute = value ? Bool.True : Bool.False
    Alert.alert('hi')
    const previousValue = this.chat.chatInfo.is_mute // workaround for staggering switch
    standalone(() => Transaction.run(() => this.chat.chatInfo.is_mute = mute))
    try {
      const response = await Api.call('POST', 'chat/paticipants/muteNotifications', { // typo in API
        group_id: this.chat.chatInfo.group_id,
        is_mute: mute,
      })
    } catch (e) {
      standalone(() => Transaction.run(() => this.chat.chatInfo.is_mute = previousValue))
      throw e
    }
  }

  @transaction
  askExitGroup(): void {
    if (this.chat.chatInfo.adminData?.user_id === App.user.id && this.chat.chatInfo.members.length > 1) {
      Alert.alert('', 'You are currently the admin of this chat group. Exiting the chat group will disable it for other members as well. Please assign someone else as the admin so other users can continue using this group.')
    } else
      Alert.alert('', 'Are you sure you want to exit this group?', [
        { text: 'No' },
        { text: 'Yes', onPress: this.exitGroup },
      ])
  }

  @transaction
  private async exitGroup(): Promise<void> {
    await Api.call('POST', 'chat/paticipants/delete', { // typo in API
      members: App.user.id,
      group_id: this.chat.roomId,
      status: RemoveMemberStatus.Exit,
    })
    if (this.chat.chatInfo.members_count !== undefined)
      this.chat.chatInfo.members_count--
    const i = this.chat.chatInfo.memberIds.findIndex(x => x === App.user.id)
    const chatInfoMemberIdsMutable = this.chat.chatInfo.memberIds.toMutable()
    chatInfoMemberIdsMutable.splice(i, 1)
    this.chat.chatInfo.memberIds = chatInfoMemberIdsMutable
    let newStatus: GroupChatStatus
    if (this.chat.chatInfo.visibility === Visibility.Public)
      newStatus = GroupChatStatus.Observer
    else
      newStatus = GroupChatStatus.NoLongerPartOfGroup
    await this.updateUserGroupChatStatusInChatRoom(this.chat.roomId, App.user.id, newStatus)
    await this.addMembersToChatRoom(this.chat.roomId, this.chat.chatInfo.memberIds.slice())
    this.drawer.close()
  }

  @transaction
  askJoinGroup(): void {
    Alert.alert('', 'Are you sure you want to join this group?', [
      { text: 'No' },
      { text: 'Yes', onPress: this.joinGroup },
    ])
  }

  @transaction
  private async joinGroup(): Promise<void> {
    await Api.call('POST', 'chat/join', { // typo in API
      groupId: this.chat.roomId,
    })
    if (this.chat.chatInfo.members_count !== undefined)
      this.chat.chatInfo.members_count++
    const chatInfoMemberIdsMutable = this.chat.chatInfo.memberIds.toMutable()
    chatInfoMemberIdsMutable.push(App.user.id)
    this.chat.chatInfo.memberIds = chatInfoMemberIdsMutable
    await this.updateUserGroupChatStatusInChatRoom(this.chat.roomId, App.user.id, GroupChatStatus.Active)
    await this.addMembersToChatRoom(this.chat.roomId, this.chat.chatInfo.memberIds.slice())
    this.chat.chatInfo.group_chat_status = GroupChatStatus.Active
    this.drawer.close()
  }

  async updateUserGroupChatStatusInChatRoom(roomId: string, userId: string, status: GroupChatStatus): Promise<void> {
    await Firebase.users.doc(userId).collection('chatRooms').doc(roomId)
      .set({ group_chat_status: status }, { merge: true })
  }

  async addMembersToChatRoom(roomId: string, memberIds: string[]): Promise<void> {
    await Firebase.chats.doc(roomId).update({ memberIds })
  }
  @transaction
  askAddToDashboard(): void {
    Alert.alert('', `Are you sure to want to ${this.addedToDashboard ? 'remove from' : 'add to'} honeycomb home screen?`, [
      { text: 'No' },
      { text: 'Yes', onPress: this.addToDashboard }
    ])
  }

  @transaction
  private async addToDashboard(): Promise<void> {
    await App.user.extraHoneyCombs.updateAddedToDashboard(HoneyCombType.Tem, !this.addedToDashboard,
      this.chat.roomId, this.chat.chatInfo.group_title)
    this.addedToDashboard = !this.addedToDashboard
  }
}

class ChatDrawer {
  private ref?: DrawerLayoutAndroid = undefined
  private opened: boolean = false

  saveRef = (ref: DrawerLayoutAndroid): void => { this.ref = ref }

  close = (): void => {
    this.ref?.closeDrawer()
    this.opened = false
  }

  toggle = (): void => {
    if (this.opened)
      this.ref?.closeDrawer()
    else
      this.ref?.openDrawer()
    this.opened = !this.opened
  }
}
