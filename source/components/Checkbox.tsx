//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { Ref } from "reactronic";
import { reactive } from "common/reactive";
import { TextStyle } from "react-native";
import { Transaction } from "reactronic";
import { Bool } from "common/constants";
import { SwitchColors } from "./Theme";
import { CheckBox } from "react-native-elements";

export interface CheckboxProps {
  model?: Ref;
  disabled?: Ref<boolean> | boolean;
  style?: TextStyle;
  dangerous?: boolean;
  onValueChanged?: (value: boolean) => void;
}

export function Checkbox(p: CheckboxProps): JSX.Element {
  return reactive(() => {
    let current = false;
    if (p.model) {
      current =
        typeof p.model.value === "number"
          ? p.model.value !== Bool.False
          : p.model.value;
    }

    const disabled: boolean =
      typeof p.disabled === "boolean" ? p.disabled : p.disabled?.value ?? false;

    const dangerous = p.dangerous ?? false;
    const thumbColor = disabled
      ? undefined
      : current
      ? dangerous
        ? SwitchColors.DangerousThumbOn
        : SwitchColors.DefaultThumbOn
      : SwitchColors.ThumbOff;
    const trackColor = dangerous ? SwitchColors.DangerousTrack : undefined;

    return (
      <CheckBox
        center
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checkedColor="#04FCF6"
        uncheckedColor="#04FCF6"
        checked={current}
        size={20}
        onPress={(value) => {
          Transaction.run(() => {
            if (p.model) {
              p.model.value = !p.model.value;
            }
            p.onValueChanged && p.onValueChanged(value);
          });
        }}
      />
    );
  });
}
