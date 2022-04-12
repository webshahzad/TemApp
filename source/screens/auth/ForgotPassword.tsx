//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { View, ScrollView, StyleSheet, ToastAndroid } from "react-native";
import { Ref } from "reactronic";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackPropsPerPath } from "navigation/params";
import { reactive } from "common/reactive";
import { Theme } from "components/Theme";
import { RoundButton } from "components/RoundButton";
import { App } from "models/app/App";
import { ImageContainer } from "components/ImageContainer/ImageContainer";
import { InputComp } from 'components/InputComp'

export function ForgotPassword(
  p: StackScreenProps<RootStackPropsPerPath, "ForgotPassword">
): JSX.Element {
  return reactive(() => {
    const m = Ref.to(App.user.stored);
    return (
      <SafeAreaView style={Theme.screen}>
        <ImageContainer title="Forgot password" goBack>
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View style={{ marginTop: "20%" }}>
                <InputComp
                  placeholder="EMAIL/PHONE"
                  model={m.username}
                  value={m.username}
                  iconNameArr={["check-circle-outline", "error-outline"]}
                  errMsg="Please enter first name"
                />

              <View style={styles.button}>
                <RoundButton
                  color="#0B82DC"
                  background="#FFFFFF"
                  label="SUBMIT"
                  borderRadius={8}
                  vertical={12}
                  horizontal={23}
                  labelStyle={Theme.buttonTexts}
                  style={{ marginTop: 20, width:126, height:41, }}
                  onPress={async () => {
                    try{
                    await App.user.forgotPassword();
                    p.navigation.push("OtpVerification", {
                      context: "forgotPassword",
                    });
                  }catch(e){
                    ToastAndroid.show(
                      (e.message),
                      ToastAndroid.SHORT
                    )
                  }
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </ImageContainer>
      </SafeAreaView>
    );
  });
}
const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
  },
  policiesToggle: {
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  policyText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 8,
    textTransform: "uppercase",
  },
});
