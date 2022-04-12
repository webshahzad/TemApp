//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { PropsWithChildren } from 'react'
import { Modal as ModalManager } from 'models/app/Modal'
import { StyleSheet, View } from 'react-native'
import Modal from 'react-native-modal'
import { reactive } from 'common/reactive'

interface ModalProps {
  manager: ModalManager
}

export function FancyBottomModal({ manager, children }: PropsWithChildren<ModalProps>): React.ReactElement {
  return reactive(() => {
    return (
      <Modal
        style={styles.modal}
        isVisible={manager.visible}
        onBackButtonPress={manager.hide}
        onBackdropPress={manager.hide}
        useNativeDriver
      >
        <View style={styles.content}>
          {children}
        </View>
      </Modal>
    )
  })
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'white',
  },
})
