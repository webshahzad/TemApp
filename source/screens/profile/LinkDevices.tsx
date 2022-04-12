//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { View, StyleSheet, Text, RefreshControl, Pressable } from 'react-native'
import { App } from 'models/app/App'
import { RoundButton } from 'components/RoundButton'
import { ScrollView } from 'react-native-gesture-handler'
import { FancyBottomModal } from 'components/FancyBottomModal'
import { Button } from 'components/Button'
import { Accessory } from 'models/app/Accessory'
import { PeerAgent } from 'react-native-samsung-accessory'

export function LinkDevices(): React.ReactElement {
  return (
    <View style={styles.screen}>
      <LinkDeviceContent />
    </View>
  )
}

function LinkDeviceContent(): React.ReactElement | null {
  return reactive(() => {
    if (!App.accessory.accessoryServiceInitialized)
      return ScreenStateMessage('Initializing device linking')
    if (!App.accessory.accessoryServiceInstalled)
      return ScreenStateMessage('Samsung Accessory Service not installed', {
        text: 'Open in Google Play',
        onPress: App.accessory.openAccessoryServiceInGooglePlay,
      })

    return (
      <View style={styles.scanResults}>
        <View style={styles.scanButtons}>
          <RoundButton
            label={App.accessory.searchingForPeers ? 'Scanning' : 'Scan'}
            onPress={App.accessory.searchingForPeers ? undefined : App.accessory.searchForPeers}
            background={App.accessory.searchingForPeers ? '#83b7ee' : '#0096E5'}
            color='white'
            style={styles.scanButton}
          />
          <RoundButton
            label='?'
            onPress={App.accessory.helpModal.show}
            background='lightgrey'
            color='black'
            style={styles.helpButton}
          />
        </View>

        <PeersList linkDevice={App.accessory} />

        <FancyBottomModal manager={App.accessory.helpModal}>
          <Help />
        </FancyBottomModal>
      </View>
    )
  })
}

export function ScreenStateMessage(text: string, button?: { text: string, onPress?: () => void }): React.ReactElement {
  return (
    <View style={styles.state}>
      <Text style={styles.stateText}>{text}</Text>
      {button ? (
        <Button label={button.text} onPress={button.onPress} />
      ) : null}
    </View>
  )
}

function PeersList({ linkDevice }: { linkDevice: Accessory }): React.ReactElement {
  return reactive(() => {
    return (
      <ScrollView
        contentContainerStyle={styles.peersList}
        refreshControl={ListRefresh(linkDevice)}
      >
        {linkDevice.peers.map(Peer)}
      </ScrollView>
    )
  })
}

function ListRefresh(linkDevice: Accessory): React.ReactElement {
  return (
    <RefreshControl refreshing={linkDevice.searchingForPeers} />
  )
}

function Peer(peer: PeerAgent): React.ReactElement {
  return (
    <Pressable
      key={peer.peerId}
      style={styles.peer}
      onPress={() => {
        App.accessory.selectPeer(peer)
        void App.accessory.authorize(peer)
      }}
    >
      <Text style={styles.deviceName}>{peer.accessory.vendorId} {peer.accessory.productId}</Text>
      <Text style={styles.deviceId}>{peer.accessory.address}</Text>
    </Pressable>
  )
}

function Help(): React.ReactElement | null {
  return (
    <View style={styles.help}>
      <Text style={styles.helpHeader}>
        Having connection troubles?
      </Text>

      <HelpAction
        label='Try unpairing'
        description='This can be done in your phone settings'
      />
      <HelpAction
        label='Try restarting bluetooth'
        description='Both in your phone and your wearable'
      />
      <HelpAction
        label='Try restarting devices'
        description='Galaxy Watch can be restarted by long pressing Home button. Phone can be restarted by long pressing Power button'
      />
    </View>
  )
}

function HelpAction({ label, description }: { label: string, description: string }): React.ReactElement {
  return (
    <View style={styles.helpAction}>
      <Text style={styles.helpActionLabel}>{label}</Text>
      <Text style={styles.helpActionDescription}>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 10,
  },

  state: {
    paddingVertical: 10,
  },
  stateText: {
    textAlign: 'center',
    marginBottom: 10,
  },

  scanResults: {
    flex: 1,
    justifyContent: 'space-around',
  },
  scanButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  scanButton: {
    flex: 1,
    marginRight: 10,
  },
  helpButton: {
    borderWidth: 0,
  },
  peersList: {
    minHeight: 80,
  },
  peer: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  deviceName: {
    flex: 1,
  },
  deviceId: {
    flex: 1,
    textAlign: 'right',
    textAlignVertical: 'center',
  },

  help: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  helpHeader: {
    marginBottom: 10,
    fontSize: 16,
  },
  helpAction: {
    marginTop: 10,
  },
  helpActionLabel: {
    fontSize: 16,
  },
  helpActionDescription: {
    fontSize: 12,
    color: 'grey',
  },
})
