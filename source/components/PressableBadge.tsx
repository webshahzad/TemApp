//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { PropsWithChildren } from "react";
import {
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  TextStyle,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BadgeProps, Badge, isTrue } from "./Badge";
import { Ref } from "reactronic";
import { reactive } from "common/reactive";

export interface PressableBadgeProps extends BadgeProps, BadgeTextProps {
  onPress?: (event: GestureResponderEvent) => void;
}

interface BadgeTextProps {
  text?: Ref<string | undefined> | string
  textStyle?: TextStyle;
  pressableAreaStyle?: object;
  placeholder?:string;
}

export const PressableBadge: React.FunctionComponent<
  PropsWithChildren<PressableBadgeProps>
> = (p) => {
  return reactive(() => {
    const readonly = p.editable !== undefined ? !isTrue(p.editable) : false;
    return (
      // <Badge {...p}>
      <TouchableOpacity
        onPress={readonly ? undefined : p.onPress}
        
        style={[styles.pressableArea, p.pressableAreaStyle]}
      >
        <BadgeText {...p}   />
        {p.children}
      </TouchableOpacity>
      //  </Badge>
    );
  });
};

const BadgeText: React.FunctionComponent<PressableBadgeProps> = (p) => {
  return reactive(() => {
    const readonly = p.editable !== undefined ? !isTrue(p.editable) : false;
    return (
      <>
     <View style={{display:'flex',flexDirection:'row'}}>
     <View>
       <Text style={{color: 'gray',fontSize:12,marginTop:10,marginLeft:15}}>{p.placeholder} </Text>
       </View>
     <View>
     <Text      
        numberOfLines={1}
        style={[
          styles.textDefaultStyle,
          p.textStyle,
          readonly ? styles.textReadOnly : undefined,
        ]}
        
      >
       {p.text?.value}  
      </Text>
     </View>
     </View>
      </>
    );
  });
};

const styles = StyleSheet.create({
  pressableArea: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  textDefaultStyle: {
    paddingVertical: 5,
    color: "black",
  },
  textReadOnly: {
    color: "lightgray",
  },
});
