//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { View, StyleSheet, ScrollView, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import { Transaction, Ref } from 'reactronic'
import { reactive } from 'common/reactive'
import { Focus } from 'common/Focus'
import { BadgeProps, isTrue } from './Badge'
import { PressableBadge } from './PressableBadge'
import { PickerManager } from 'models/app/PickerManager'

interface PickerBadgeProps<TOption> extends Omit<BadgeProps, 'selected'>, PickerBadgeValueProps<TOption> { }

interface PickerBadgeValueProps<TOption> {
  manager: PickerManager<TOption>
  getKey?: (item: TOption) => string
  renderPickerItem?: (item: TOption, index: number, active?: boolean) => React.ReactElement
  renderEmptyPicker?: (active?: boolean) => React.ReactElement
  renderSelectedItem?: (item: TOption, index: number, readonly: boolean) => React.ReactElement
  doBeforeOpen?: () => (void | Promise<void>)
  pressableAreaStyle?: object
}

export function PickerBadge<TOption>(p: PickerBadgeProps<TOption>): React.ReactElement {
  const [pickerFocus] = React.useState(() => Transaction.run(() => new Focus()))
  const focusRef = Ref.to(pickerFocus)
  const manager = p.manager

  const hideModal = (): void => {
    pickerFocus.setFocused(false)
    manager.setVisible(false)
  }
  return reactive(() => {
    return (
      <>
        <PressableBadge
          {...p}
            pressableAreaStyle={p.pressableAreaStyle}
          selected={focusRef.focused}
          onPress={async () => {
            pickerFocus.setFocused(true)
            if (p.doBeforeOpen)
              await p.doBeforeOpen()
            manager.setVisible(true)
          }}
        >
          <PickerValue {...p} />
        </PressableBadge>
        <Modal
          style={styles.modal}
          isVisible={manager.visible}
          onBackButtonPress={hideModal}
          onBackdropPress={hideModal}
          propagateSwipe
          useNativeDriver
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {renderModalContent<TOption>(p, i => manager.selectOption(i), hideModal)}
            </ScrollView>
          </View>
        </Modal>
      </>
    )
  })
}

function PickerValue<TOption>(p: PickerBadgeValueProps<TOption> & { editable?: boolean | Ref<boolean> | Ref<number> }): JSX.Element | null {
  return reactive(() => {
    const readonly = p.editable !== undefined ? !isTrue(p.editable) : false
    let child: JSX.Element = <View />
    const selectedOption = p.manager.selectedOption
    if (selectedOption === undefined) {
      if (p.renderEmptyPicker)
        child = p.renderEmptyPicker()
    }
    else if (p.renderSelectedItem)
      child = p.renderSelectedItem(selectedOption, p.manager.selectedIndex, readonly)
    else if (p.renderPickerItem)
      child = p.renderPickerItem(selectedOption, p.manager.selectedIndex)
    return child
  })
}

function renderModalContent<TOption>(
  p: PickerBadgeValueProps<TOption>,
  selectOption: (i: number) => void,
  hideModal: () => void
): React.ReactNode {
  const options = p.manager.options
  if (p.renderPickerItem && options.length) {
    const getKey = getKeyFactory(p)
    return (
      options.map((item, index) => (
        <Pressable
          key={getKey(item, index)}
          onPress={() => {
            selectOption(index)
            hideModal()
          }}
        >
          {p.renderPickerItem!(item, index, false)}
        </Pressable>
      ))
    )
  }
  else
    return null
}

function getKeyFactory<TOption>(p: PickerBadgeProps<TOption>): (item: TOption, index: number) => string {
  if (p.getKey)
    return p.getKey
  return (_, index) => `picker-item-${index}`
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: '80%',
    backgroundColor: 'white',
  },
})
