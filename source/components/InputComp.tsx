//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { Ref } from "reactronic";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import { Transaction } from "reactronic";
import { Bool } from "common/constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import { App } from "models/app/App";
import { reactive } from "common/reactive";

export interface InputProps {
  model?: Ref;
  disabled?: Ref<boolean> | boolean;
  style?: TextStyle;
  dangerous?: boolean;
  secured?: boolean;
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: KeyboardTypeOptions;
  onValueChanged?: (value: boolean) => void;
  onFocus?: (value: boolean) => void | undefined;
  onBlur?: (value: any) => void | undefined;
  value: Ref;
  iconNameArr: string[];
  placeholder: string;
  errMsg: string;
  isError: Ref;
  iconError: any;
  modal?: Ref<string | number | undefined>;
}

export function InputComp(p: InputProps): JSX.Element {
  return reactive(() => {
    let u = Ref.to(App.user);
    let current = true;
    if (p.model) {
      current =
        typeof p.model.value === "number"
          ? p.model.value !== Bool.False
          : p.model.value;
    }

    const disabled: boolean =
      typeof p.disabled === "boolean" ? p.disabled : p.disabled?.value ?? false;
    const iconName =
      p.model?.value?.length > 3 ? p.iconNameArr[0] : p.iconNameArr[1];
    const iconColor = p.model?.value?.length > 3 ? "green" : "red";
    let defaultValue = p.model?.value;
    if (typeof defaultValue === "number") {
      defaultValue = defaultValue.toString();
    }
    return (
      <>
        <View
          style={{
            width: "85%",
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              defaultValue={defaultValue}
              placeholder={p.placeholder}
              onBlur={p.onBlur}
              underlineColorAndroid="transparent"
              secureTextEntry={p.secured}
              autoCapitalize={p.autoCapitalize}
              onFocus={p.onFocus}
              multiline={p.multiline}
              defaultValue={defaultValue}
              placeholderTextColor="#707070"
              //   editable={!readonly}
              keyboardType={p.keyboardType}
              onChangeText={(value) => {
                Transaction.run(() => {
                  // let regex = /^(?:[A-Z\d][A-Z\d_-]{5,10}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i
                  // let validEmail = regex.test(value)
                  // {validEmail ? u.isIcon.value = true : u.isIcon.value = false}
                  if (p.model) {
                    if (typeof p.model.value === "number") {
                      p.model.value = value ? Bool.True : Bool.False;
                    } else {
                      p.model.value = value;
                    }
                  }
                });
              }}
            />

            {Ref.to(App.user).isIcon && (
              // {p.model?.value?.length > 0 && (
              <View>
                <Icon
                  style={{ position: "absolute", right: 10, top: -8 }}
                  name={iconName}
                  size={15}
                  color={iconColor}
                />
              </View>
            )}
          </View>
          <>
            {p.isError ? (
              <Text
                style={{
                  fontSize: 12,
                  color: "ff0000",
                  alignSelf: "flex-start",
                  paddingLeft: 8,
                  width: 250,
                }}
              >
                {p.errMsg}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  color: "red",
                  alignSelf: "flex-start",
                  paddingLeft: 8,
                }}
              ></Text>
            )}
          </>
        </View>
      </>
    );
  });
}
const styles = StyleSheet.create({
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 45,
    height: 35,
    backgroundColor: "#fff",
    marginTop: 20,
    marginBottom: 10,
    // marginLeft: 10,
  },
  input: {
    borderRadius: 45,
    backgroundColor: "#fff",
    color: "black",
    fontSize: 8,
    lineHeight: 13,
    width: "100%",
    height: 41,
    fontWeight: "500",
    paddingLeft: 15,
  },
});
