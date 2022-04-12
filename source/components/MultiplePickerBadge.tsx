//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import Modal from "react-native-modal";
import { Transaction, Ref } from "reactronic";
import { reactive } from "common/reactive";
import { Focus } from "common/Focus";
import { BadgeProps } from "./Badge";
import { PressableBadge } from "./PressableBadge";
import { MultiplePickerManager } from "models/app/MultiplePickerManager";
import { RoundButton } from "./RoundButton";

interface MultiplePickerBadgeProps<TOption>
  extends Omit<BadgeProps, "selected">,
    MultiplePickerBadgeValueProps<TOption> {}

interface MultiplePickerBadgeValueProps<TOption> {
  options: TOption[];
  model: Ref<TOption[]>;
  comparer?: (a: TOption, b: TOption) => boolean;
  getKey?: (item: TOption) => string;
  renderPickerItem?: (
    item: TOption,
    index: number,
    active: boolean
  ) => React.ReactElement;
  renderEmptyPicker?: (active?: boolean) => React.ReactElement;
  renderSelectedItems?: (
    items: TOption[],
    active: boolean
  ) => React.ReactElement;
  doBeforeOpen?: (
    manager: MultiplePickerManager<TOption>
  ) => void | Promise<void>;
  multiPickerStyle?: object;
}

export function MultiplePickerBadge<TOption>(
  p: MultiplePickerBadgeProps<TOption>
): React.ReactElement {
  const [pickerFocus] = useState(() => Transaction.run(() => new Focus()));
  const focusRef = Ref.to(pickerFocus);
  const [manager] = useState(() =>
    Transaction.run(
      () => new MultiplePickerManager(p.options, p.model, p.comparer)
    )
  );

  const hideModal = (): void => {
    pickerFocus.setFocused(false);
    manager.setVisible(false);
  };

  return reactive(() => {
    return (
      <>
        <PressableBadge
          {...p}
          pressableAreaStyle={p.multiPickerStyle}
          selected={focusRef.focused}
          onPress={async () => {
            pickerFocus.setFocused(true);
            if (p.doBeforeOpen) await p.doBeforeOpen(manager);
            manager.setVisible(true);
          }}
        >
          <PickerValue {...p} manager={manager} focusRef={focusRef.focused} />
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
              {renderModalContent<TOption>({
                p,
                manager,
                selectOption: (i) => manager.toggleOption(i),
              })}
            </ScrollView>
            <RoundButton
              label="Done"
              onPress={hideModal}
              color="white"
              horizontal={30}
              vertical={10}
              background="#0096E5"
              borderRadius={40}
              style={styles.modalButton}
            />
          </View>
        </Modal>
      </>
    );
  });
}

function PickerValue<TOption>({
  manager,
  focusRef,
  ...p
}: MultiplePickerBadgeValueProps<TOption> & {
  manager: MultiplePickerManager<TOption>;
  focusRef: Ref<boolean>;
}): React.ReactElement | null {
  return reactive(() => {
    let child: React.ReactElement = <View />;
    const selectedOptions = manager.selectedOptions;
    if (selectedOptions.length === 0) {
      if (p.renderEmptyPicker) child = p.renderEmptyPicker(focusRef.value);
    } else if (p.renderSelectedItems)
      child = p.renderSelectedItems(selectedOptions, focusRef.value);
    return child;
  });
}

function renderModalContent<TOption>({
  p,
  manager,
  selectOption,
}: {
  p: MultiplePickerBadgeValueProps<TOption>;
  manager: MultiplePickerManager<TOption>;
  selectOption: (i: number) => void;
}): React.ReactNode {
  const options = p.options;
  if (p.renderPickerItem && options.length) {
    const getKey = getKeyFactory(p);
    return options.map((item, index) => (
      <Pressable
        key={getKey(item, index)}
        onPress={() => {
          selectOption(index);
        }}
      >
        {p.renderPickerItem!(item, index, manager.isSelected(index))}
      </Pressable>
    ));
  } else return null;
}

function getKeyFactory<TOption>(
  p: MultiplePickerBadgeProps<TOption>
): (item: TOption, index: number) => string {
  if (p.getKey) return p.getKey;
  return (_, index) => `picker-item-${index}`;
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: "80%",
    backgroundColor: "white",
  },
  modalButton: {
    alignSelf: "center",
    color: "white",

    marginVertical: 10,
  },
});
