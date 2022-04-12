//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import {
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  Text,
  ColorValue,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface RoundButtonProps {
  leftIcon?: string;
  rightIcon?: string;
  AppleIcon?: string;
  label: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  color?: ColorValue;
  background?: ColorValue;
  borderWidth?: number;
  fontWeight?: number;
  leftIconcolor?: ColorValue;
  rightIconcolor?: ColorValue;
  leftIconSize?: number;
  rightIconSize?: number;
  horizontal?: number;
  vertical?: number;
  borderRadius?: number;
  onPress?: (event: GestureResponderEvent) => void;
}

export const RoundButton = (p: RoundButtonProps): React.ReactElement => {
  const decor: StyleProp<ViewStyle> = {
    borderColor: p.color,
    borderWidth: p.borderWidth,
    backgroundColor: p.background,
  };

  return (
    <View
      style={[
        styles.pressableContainer,
        decor,
        p.style,
        { borderRadius: p.borderRadius },
      ]}
    >
      <TouchableOpacity
        onPress={p.onPress}
        style={[
          styles.pressable,
          { paddingHorizontal: p.horizontal, paddingVertical: p.vertical },
        ]}
      >
        {p.leftIcon && (
          <Icon
            name={p.leftIcon}
            style={[
              styles.leftIcon,
              {
                color: p.leftIconcolor,
                fontSize: p.leftIconSize,
                backgroundColor: p.background,
              },
            ]}
          />
        )}
        {p.label && (
          <Text style={[styles.label, p.labelStyle, { color: p.color }]}>
            {p.label}
          </Text>
        )}
        {p.rightIcon && (
          <Icon
            name={p.rightIcon}
            style={[
              styles.rightIcon,
              {
                color: p.rightIconcolor,
                fontSize: p.rightIconSize,
                backgroundColor: p.background,
              },
            ]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  pressable: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leftIcon: {
    marginRight: 8,
    fontWeight: "500",
  },
  rightIcon: {
    marginLeft: 8,
    fontWeight: "500",
  },
  label: {
    fontSize: 12,
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#FFFFFF",
    fontWeight: "bold",
  },
});
