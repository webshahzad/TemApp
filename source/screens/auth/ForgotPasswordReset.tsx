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
import { InputBadge } from "components/InputBadge";
import { RoundButton } from "components/RoundButton";
import { App } from "models/app/App";
import { ImageContainer } from "components/ImageContainer/ImageContainer";

export function ForgotPasswordReset(
  p: StackScreenProps<RootStackPropsPerPath, "ForgotPasswordReset">
): JSX.Element {
  return reactive(() => {
    const m = Ref.to(App.user);
    return (
      <SafeAreaView style={Theme.screen}>
        <ImageContainer goBack title="Reset Password">
          <ScrollView
            contentContainerStyle={{ alignItems: "center", marginTop: "25%" }}
          >
            <View style={Theme.section}>
              <InputBadge
                style={styles.input}
                placeholder="Password"
                secured
                model={m.password}
              />
              <InputBadge
                style={styles.input}
                placeholder="Confirm Password"
                secured
                model={m.password2}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <RoundButton
                color="#0B82DC"
                background="#FFFFFF"
                label="SUBMIT"
                borderRadius={8}
                labelStyle={Theme.buttonText}
                vertical={12}
                horizontal={2}
                style={styles.resetButton}
                onPress={async () => {
                  try {
                    await App.user.resetPassword();
                    p.navigation.push("LogIn");
                  } catch (e) {
                    ToastAndroid.show(e, ToastAndroid.SHORT);
                  }
                }}
              />
            </View>
          </ScrollView>
        </ImageContainer>
      </SafeAreaView>
    );
  });
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    maxWidth: "90%",
    marginBottom:8
  },
  resetButton: {
    minWidth: 128,
    borderRadius: 10.5,
    marginTop: 10,
  },
});
