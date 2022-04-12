//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { PropsWithChildren } from "react";
import {
  View,
  StyleSheet,
  Text,
  ViewStyle,
  ImageSourcePropType,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import SimpleIcon from "react-native-vector-icons/SimpleLineIcons";
import { Ref } from "reactronic";
import { reactive } from "common/reactive";
import { Bool } from "common/constants";
import { MainBlueColor } from "./Theme";

export interface BadgeProps {
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  label?: string;
  labelColor?: string;
  onDateChange?: (value:any)=> void
  labelBackgroundColor?: string;
  icon?: string | ImageSourcePropType;
  simpleIcon?: string;
  selected?: boolean | Ref<boolean>;
  editable?: boolean | Ref<boolean> | Ref<number>;
  error?: string;
  showError?: boolean | Ref<boolean>;
}

export function Badge(p: PropsWithChildren<BadgeProps>): JSX.Element {
  return reactive(() => {
    const readonly = p.editable !== undefined ? !isTrue(p.editable) : false;
    const selected: boolean =
      p.selected !== undefined ? isTrue(p.selected) : false;

    const badgeColor = readonly
      ? "lightgray"
      : selected
      ? MainBlueColor
      : "gray";
    const labelBackgroundStyle = p.labelBackgroundColor
      ? { backgroundColor: p.labelBackgroundColor }
      : undefined;

    return (
      <View style={[styles.badgeContainer, p.style]}>
        <View
          style={[styles.badge, p.contentStyle, { borderColor: badgeColor }]}
        >
          {p.label && (
            <Text
              style={[
                styles.label,
                labelBackgroundStyle,
                { color: p.labelColor },
              ]}
            >
              {p.label}
            </Text>
          )}
          {p.icon !== undefined &&
            (typeof p.icon === "string" ? (
              <Icon
                name={p.icon}
                size={17}
                style={[styles.icon, { color: badgeColor }]}
              />
            ) : (
              <Image
                source={p.icon}
                fadeDuration={0}
                style={[styles.icon, { resizeMode: "contain" }]}
                tintColor={badgeColor}
              />
            ))}
          {p.simpleIcon && (
            <SimpleIcon
              name={p.simpleIcon}
              size={17}
              style={[styles.icon, { color: badgeColor }]}
            />
          )}
          <View style={styles.badgeContent}>{p.children}</View>
        </View>
        {p.showError !== undefined && isTrue(p.showError) && p.error ? (
          <Text style={styles.error}>{p.error}</Text>
        ) : null}
      </View>
    );
  });
}
Badge.defaultProps={
  labelColor:'#3e3e3e'
}
export function isTrue(
  editable: boolean | Ref<boolean> | Ref<number>
): boolean {
  let result = false;
  if (editable !== undefined) {
    if (typeof editable === "boolean") {
      result = editable;
    } else {
      if (typeof editable.value === "number")
        result = editable.value !== Bool.False;
      else result = editable.value;
    }
  }
  return result;
}

const styles = StyleSheet.create({
  badgeContainer: {},

  icon: {
    height: 20,
    width: 20,
    marginHorizontal: 8,
  },

  label: {
    position: "absolute",
    top: -18,
    left: 16,
    color: "#0B82DC",
    paddingHorizontal: 10,
    textTransform: "capitalize",
    borderRadius: 5,
    backgroundColor: "#2e2e2e",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    paddingHorizontal: 10,
    // borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },

  badgeContent: {
    // flex: 1,
    paddingVertical: 5,
    display: "flex",
    alignItems: "stretch",
    minHeight: 40,
  },

  error: {
    color: "red",
    fontSize: 12,
    marginLeft: 35,
  },
});


