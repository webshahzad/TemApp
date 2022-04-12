//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { Ref } from "reactronic";
import { reactive } from "common/reactive";
import { StyleSheet, View, Pressable, Text, Image } from "react-native";
import { Transaction } from "reactronic";
import check from "assets/images/ontoggle.png";
import unCheck from "assets/images/offtoggle.png";
export interface RadioButtonInfo {
  label: string;
  value: any;
}

export interface RadioGroupProps {
  buttons: RadioButtonInfo[];
  model?: Ref;
  onChange:(value:any)=>void

  horizontal?: boolean;
  noValue?: any;
  gym?: true;
}

export function RadioGroup(p: RadioGroupProps): JSX.Element {
  return reactive(() => {
    const uncheckImage = () => {
      return <Image source={unCheck} />;
    };
    const checkImage = () => {
      return <Image source={check} />;
    };
    return (
      <View
        style={[styles.container, p.horizontal ? styles.horizontal : undefined]}
      >
        {p.buttons.map((button) => {
          const enabled = button.value === p.model?.value;
          const icon = enabled ? { checkImage } : { uncheckImage };
          const iconColor = enabled ? "#04FCF6" : "#04FCF6";
          return (
            <Pressable
              key={button.label}
              style={styles.button}
              onPress={() => {
                Transaction.run(() => {
                  if (p.model)
                    if (p.model.value === button.value) {
                      if (p.noValue !== undefined) {
                        p.model.value = p.noValue;
                      }
                    } else {
                      p.model.value = button.value;
                    }
                });
              }}
            >
              {p.gym ? (
                <>
                  {enabled ? checkImage() : uncheckImage()}
                  <Text style={styles.label}>{button.label}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.label}>{button.label}</Text>
                  {enabled ? checkImage() : uncheckImage()}
                </>
              )}
            </Pressable>
          );
        })}
      </View>
    );
  });
}

const styles = StyleSheet.create({
  container: {
    width: "60%",
    alignItems: "center",
    marginLeft: 30,
  },
  horizontal: {
    flexDirection: "row",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginRight: 20,
  },
  label: {
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 8,
    shadowColor: "#fff",
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    marginHorizontal: 10,
  },
  icon: {
    left: 1,
  },
});
