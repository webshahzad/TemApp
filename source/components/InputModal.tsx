//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { View, StyleSheet, ImageSourcePropType, Text, TextStyle, KeyboardTypeOptions } from 'react-native'
import { Ref } from 'reactronic'
import Modal from 'react-native-modal'

import { reactive } from 'common/reactive'
import { InputBadge } from './InputBadge'
import { RoundButton } from './RoundButton'
import { MainBlueColor } from './Theme'
import { ObservableObject, transaction } from 'reactronic'

interface InputModalProps {
  manager: InputModalManager
  icon?: string | ImageSourcePropType
  title?: string
  titleStyle?: TextStyle
  keyboardType?: KeyboardTypeOptions
  submitTitle?: string
  cancelTitle?: string
}

export function InputModal(p: InputModalProps): React.ReactElement {
  const manager = p.manager
  const valueRef = Ref.to(manager).value


  console.log("valueRefData",valueRef)
  const submit = (): void => {
    manager.onSubmit && manager.onSubmit(manager.value ?? '')
    manager.hide()
  }

  const dismiss = (): void => {
    manager.onCancel && manager.onCancel()
    manager.hide()
  }

  return reactive(() => {
    return (
      <Modal
        style={styles.modal}
        isVisible={manager.visible}
        onBackButtonPress={dismiss}
        onBackdropPress={dismiss}
        propagateSwipe
        useNativeDriver
      >
        <View style={styles.modalContent}>
          <Text style={[styles.title, p.titleStyle]}>{p.title}</Text>
          <InputBadge
            icon={p.icon}
            model={valueRef}
            placeholder={p.manager.placeholder}
            keyboardType={p.keyboardType}
            style={styles.input}
          />
          <View style={styles.buttons}>
            <RoundButton
              label={p.submitTitle ?? 'SUBMIT'}
              color='white'
              background={MainBlueColor}
              onPress={submit}
              style={styles.button}
              vertical={8}
              borderRadius={10}
             

            />
            <RoundButton
              label={p.cancelTitle ?? 'CANCEL'}
              color='gray'
              onPress={dismiss}
              style={styles.button}
            />
          </View>
        </View>
      </Modal>
    )
  })
}

export class InputModalManager extends ObservableObject {
  visible: boolean = false

  value?: string = undefined
  placeholder?: string = undefined
  onSubmit?: (text: string) => void = undefined
  onCancel?: () => void = undefined

  constructor() {
    super()
  }

  @transaction
  show(o: {
    onSubmit?: (text: string) => void,
    onCancel?: () => void,
    placeholder?: string,
    defaultValue?: string,
  }): void {
    this.onSubmit = o.onSubmit
    this.onCancel = o.onCancel
    this.placeholder = o.placeholder
    this.value = o.defaultValue

    this.visible = true
  }

  @transaction
  hide(): void {
    this.visible = false
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: '80%',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    color: 'black',
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
  input: {
    alignSelf: 'stretch',
    width:'85%'
  },
  buttons: {
    width: '30%',
  
  },
  button: {
    marginTop: 10,
      },
})
