import React from "react";
import { CheckBox } from "react-native-elements";
import { Alert, ColorValue, Image, TextStyle, View } from "react-native";
import { Ref, Transaction } from "reactronic";
import { Bool } from "common/constants";
import { reactive } from "common/reactive";
import check from "assets/images/ontoggle.png";
import InsetShadow from "react-native-inset-shadow";
import active from "assets/images/active.png";
import unCheck from "assets/images/offtoggle.png";
export interface CheckboxProps {
  model?: Ref;
  disabled?: boolean;
  style?: object;
  dangerous?: boolean;
  customCheckBox?: boolean;
  top?:number;
  bottom?:number;
  left?:number;
  right?:number;
  isPress?:boolean
  onPress?: (e:any)=>void
  background?: ColorValue;
  shadow?: ColorValue;
  onValueChanged?: (value: boolean) => void;
}

export function CheckBoxComp(p: CheckboxProps): JSX.Element {
  return reactive(() => {
    let current = false;

    if (p.model) {
      current =
        typeof p.model.value === "number"
          ? p.model.value !== Bool.False
          : p.model.value;
    }
    const uncheckImage = () => {
      return (
        <>
          {p.customCheckBox ? (
            <View
              style={{
                backgroundColor: p.background,
                width: 22,
                height: 22,
                borderRadius: 11,
                top:p.top,
                bottom:p.bottom,
                left:p.left,
                right:p.right
              }}
            >
              <InsetShadow
                shadowColor={p.shadow}
                shadowRadius={10}
                elevation={7}
                shadowOffset={3}
                shadowOpacity={0.7}
                containerStyle={{ borderRadius: 11 }}
              ></InsetShadow>
            </View>
          ) : (
            <Image source={unCheck} />
          )}
        </>
      );
    };
    const checkImage = () => {
      return (
        <>
          {p.customCheckBox ? (
            <View
              style={{
                backgroundColor: p.background,
                width: 22,
                height: 22,
                borderRadius: 11,
                top:p.top,
                bottom:p.bottom,
                left:p.left,
                right:p.right
              }}
            >
              <InsetShadow
                shadowColor={p.shadow}
                shadowRadius={10}
                elevation={10}
                shadowOffset={3}
                shadowOpacity={0.9}
                containerStyle={{
                  borderRadius: 11,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image source={active} />
              </InsetShadow>
            </View>
          ) : (
            <Image source={check} />
          )}
        </>
      );
    };

    return (
      <CheckBox
        center
        uncheckedIcon={uncheckImage()}
        checkedIcon={checkImage()}
        checkedColor="#04FCF6"
        uncheckedColor="#04FCF6"
        checked={current}
        size={20}
        disabled={p.disabled}
        onPress={ p.isPress ? p.onPress :  (value) => {
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

export default CheckBoxComp;
