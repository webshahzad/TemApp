//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import {
  StyleSheet,
  ViewStyle,
  TextInput,
  KeyboardTypeOptions,
  Pressable,
  View,
  Text,
} from "react-native";
import { Transaction, Ref } from "reactronic";
import Icon from "react-native-vector-icons/MaterialIcons";

import { reactive } from "common/reactive";
import { BadgeProps, isTrue, Badge } from "./Badge";
import { Focus } from "common/Focus";
import { DangerColor } from "./Theme";

export interface InputBadgeButton {
  icon: string;
  onPress: () => void;
  color: string;
  size?: number;
}

export interface InputBadgeProps extends Omit<BadgeProps, "selected"> {
  model?: Ref<string | number | undefined>;
  placeholder?: string | string[];
  value?: string;
  secured?: boolean;
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: KeyboardTypeOptions;
  buttons?: InputBadgeButton[];
  clearButton?: boolean;
  inputTop?: number;
  isError?:boolean;
  error?: string;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
}

export function InputBadge(p: InputBadgeProps): JSX.Element {
  const [inputFocus] = React.useState(() => Transaction.run(() => new Focus()));
  const focusRef = Ref.to(inputFocus);
  return reactive(() => {
    return (
      <Badge {...p} selected={focusRef.focused}>
        <View style={{}}>
          <View style={{ ...styles.container, marginTop: p.inputTop }}>
            {p.buttons &&
              p.buttons.map((b) => (
                <Pressable
                  key={b.icon}
                  style={styles.button}
                  onPress={b.onPress}
                >
                  <Icon name={b.icon} size={b.size} color={b.color} />
                </Pressable>
              ))}
            <InputBadgeValue {...p} inputFocus={inputFocus} />
          </View>
         {p.isError &&
          <Text
            style={[
              styles.validationMessage,
              {
                color: true ? DangerColor : "transparent",
              },
            ]}
          >
            {p.error}
          </Text>
  }
        </View>
      </Badge>
    );
  });
}

function ClearButton(p: InputBadgeProps): JSX.Element {
  return reactive(() => {
    const showClearButton =
      p.clearButton === true &&
      p.model?.value !== undefined &&
      p.model.value !== "";
    return (
      <>
        {showClearButton && (
          <Pressable
            style={styles.button}
            onPress={() => Transaction.run(() => (p.model!.value = ""))}
          >
            <Icon name="times-circle" color="gray" />
          </Pressable>
        )}
      </>
    );
  });
}

function InputBadgeValue(
  p: InputBadgeProps & { inputFocus: Focus }
): JSX.Element {
  return reactive(() => {
    const readonly = p.editable !== undefined ? !isTrue(p.editable) : false;
    // let defaultValue = readonly ? undefined : p.model?.value
    let defaultValue = p.model?.value;
    if (typeof defaultValue === "number") {
      defaultValue = defaultValue.toString();
    }
    return (
      <TextInput
        maxLength={40}
        style={[
          styles.input,
          p.multiline ? styles.multiline : undefined,
          readonly ? styles.readonly : undefined,
        ]}
        placeholder={p.placeholder}
        value={p.value}
        underlineColorAndroid="transparent"
        secureTextEntry={p.secured}
        autoCapitalize={p.autoCapitalize}
        multiline={p.multiline}
        defaultValue={defaultValue}
        placeholderTextColor="#707070"
        editable={!readonly}
        keyboardType={p.keyboardType}
        onChangeText={(value) => {
          Transaction.run(() => {
            if (p.model) p.model.value = value;
          });
        }}
        onFocus={p.onFocus}
        onBlur={p.onBlur}

        // onFocus={() => {
        //   p.inputFocus.setFocused(true);
        // }}
        // onBlur={() => {
        //   p.inputFocus.setFocused(false);
        // }}
      />
    );
  });
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    // paddingHorizontal: 30,
    borderRadius: 45,
    height: 30,
    marginBottom: -15,
  },

  input: {
    borderRadius: 45,
    backgroundColor: "#FFF",
    color: "black",
    fontSize: 12,
    lineHeight: 13,
    width: "100%",
    height: 41,
    fontWeight: "500",
    paddingLeft: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    overflow:'hidden',
  } as ViewStyle,

  multiline: {
    height: 100,
    textAlignVertical: "top",
  },

  readonly: {
    color: "lightgray",
  },

  button: {
    marginRight: 45,
    position: "absolute",
    // right:5
  },
  validationMessage: {
    color: DangerColor,
    fontSize: 12,
    paddingLeft: 50,
    marginLeft: 30,
  },
});
