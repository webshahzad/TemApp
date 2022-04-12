//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon1 from "react-native-vector-icons/MaterialCommunityIcons";
import { App } from "models/app/App";
import { useNavigation } from '@react-navigation/native'
import feed from "assets/feedicon.png"

const DefaultButtonSize = 20;

export interface HeaderButton {
  simpleIcon: string;
  materialIcon: string;
  simpleIconStyle?: StyleProp<TextStyle>;
  onPress: () => void;
  size?: number;
  color?: string;
}

export abstract class HeaderButton {
  static globalSearch: HeaderButton = {
    simpleIcon: "search",
    onPress: () => App.globalSearch.show(),
  };
  static newPost: HeaderButton = {
    materialIcon: "post",
    onPress: () => App.openNewPost(),
  };
}

interface HeaderProps {
  buttons: HeaderButton[];
  tintColor?: string;
  materialIcon?:string
}

export function HeaderRight({ buttons, tintColor }: HeaderProps): JSX.Element {
  const navigation = useNavigation()
  return (
    <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", width:'100%'}}>
    <View style={styles.rightHeader}>
      {buttons.map((b, i) => {
        return (
          <TouchableOpacity
            key={i}
            onPress={()=>navigation.navigate("Feed")}
            style={styles.rightHeaderButton}
          >
            <Image source={feed}
             style={styles.simpleIconStyle}
            /> 
            {/* <Icon1
              name="post"
              color={tintColor ?? b.color ?? "black"}
              size={b.size ?? DefaultButtonSize}
              style={styles.simpleIconStyle}
            /> */}
          </TouchableOpacity>
        );
      })}
    </View>
    <View style={styles.rightHeader}>
      {buttons.map((b, i) => {
        return (
          <TouchableOpacity
            key={i}
            onPress={b.onPress}
            style={styles.rightHeaderButton}
          >
            <Icon
              name={b.simpleIcon}
              color={tintColor ?? b.color ?? "black"}
              size={b.size ?? DefaultButtonSize}
              style={styles.simpleIconStyle}
            />
          </TouchableOpacity>
        );
      })}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rightHeader: {
    alignSelf: "flex-end",
    margin: 30,
    backgroundColor: "#00508a",
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  rightHeaderButton: {
    backgroundColor: "#0682DC",
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
   },
  simpleIconStyle: {
    color: "#f4f4f4",
    fontWeight: "600",
    borderColor: "red",
    fontSize: 20,
  },
});
