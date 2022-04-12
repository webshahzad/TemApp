import React from "react";
import {
    Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Neomorph } from "react-native-neomorph-shadows";
import { MorphShadow } from "./MorphShadow";

export interface IButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  BgColor: string;
  width: number;
  height: number;
  text: string;
  textColor: string;
  style: object;
  borderRadius:number

}

export function ShadowButton(p: IButtonProps) {
    const windowWidth = Dimensions.get("window").width;

  return (
    <TouchableOpacity style={p.style} onPress={p.onPress}>
      <MorphShadow
        shadowStyle={{
          shadowColor: "#000",
          borderRadius:  p.borderRadius,
          backgroundColor: p.BgColor, // "#F7F7F7",
          width: windowWidth / 100 * p.width,
          height: windowWidth / 100 * p.height,
        }}
      >
        <View style={styles.buttonView}>
          <Text style={[styles.buttonText, { color: p.textColor }]}>
            {p.text}
          </Text>
        </View>
      </MorphShadow>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    shadowColor: "#000",
  },
});
