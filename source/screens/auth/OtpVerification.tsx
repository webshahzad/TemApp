//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  Text,
  ScrollView,
  Pressable,
  ToastAndroid,
} from "react-native";
import { Transaction } from "reactronic";
import { SafeAreaView } from "react-native-safe-area-context";
import { CodeField, Cursor } from "react-native-confirmation-code-field";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackPropsPerPath } from "navigation/params";
import { reactive } from "common/reactive";
import { Theme } from "components/Theme";
import { RoundButton } from "components/RoundButton";
import { App, StartScreen } from "models/app/App";
import { ImageContainer } from "components/ImageContainer/ImageContainer";
import { CountDown } from "components/Timer";

export function OtpVerification(
  p: StackScreenProps<RootStackPropsPerPath, "OtpVerification">
): JSX.Element {
  return reactive(() => {
    const handleOtp = async () => {
      try {
        if (p.route.params.context === "forgotPassword") {
          await App.user.verifyForgotPasswordCode();
          p.navigation.replace("ForgotPasswordReset");
        } else if (p.route.params.context === "email") {
          await App.user.verifyEmail();
          p.navigation.pop();
        } else if (p.route.params.context === "phone") {
          await App.user.verifyPhone();
          p.navigation.pop();
        } else {
          // p.route.params.context === 'signUp'

          await App.user.verifySignUpCode();
          await App.saveStartScreen(StartScreen.CreateProfile); // save state to open on App restart
          p.navigation.reset({
            routes: [{ name: "CreateProfile" }],
          });
        }
      } catch (e) {
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
      }
    };
    return (
      <SafeAreaView style={Theme.screen}>
        <ImageContainer title="otp verification" goBack={false}>
          <ScrollView
            style={{}}
            contentContainerStyle={{
              paddingLeft: 70,
              marginTop: "40%",
            }}
          >
            <View style={{ marginBottom: 10 }}>
              <Text style={Theme.otpText}>
                ENTER ONE TIME PASSWORD (OTP) SENT TO YOU
              </Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <CodeField
                rootStyle={[Theme.otpBox, { width: "95%", paddingLeft: 20 }]}
                onChangeText={(value) => {
                  Transaction.run(() => {
                    if (value) App.user.otp_code = value;
                  });
                }}
                cellCount={4}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) =>
                  reactive(() => {
                    const sym = App.user.otp_code?.[index];
                    return (
                      <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                      >
                        {sym || (isFocused ? <Cursor /> : null)}
                      </Text>
                    );
                  })
                }
              />
              <View style={styles.timer}>
                <Text style={styles.timerText}>
                  Timer <CountDown />
                </Text>
                <Pressable>
                  <Text
                    style={[styles.btnText, { left: 50, borderWidth: 0.5 }]}
                  >
                    RESEND
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.btnWrapper}>
              <RoundButton
                color="#0B82DC"
                background="#FFFFFF"
                borderRadius={8}
                vertical={12}
                labelStyle={Theme.buttonText}
                horizontal={33}
                label="SUBMIT"
                onPress={handleOtp}
              />
            </View>
            {
              // p.route.params.context !== 'signUp' &&
              <View style={styles.cancelBtn}>
                <Pressable onPress={() => p.navigation.goBack()}>
                  <Text style={styles.btnText}> CANCEL</Text>
                </Pressable>
              </View>
            }
          </ScrollView>
        </ImageContainer>
      </SafeAreaView>
    );
  });
}

const styles = StyleSheet.create({
  cell: {
    width: 52,
    height: 50,
    lineHeight: 48,
    fontSize: 32,
    right: 30,
    borderWidth: 1,
    backgroundColor: "#FFFF",
    borderColor: "#00000030",
    borderRadius: 10.5,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  } as ViewStyle,

  timerText: {
    color: "#FFFFFF",
    fontWeight: "normal",
    fontSize: 10,
  } as ViewStyle,
  btnText: {
    color: "#FFFFFF",
    fontWeight: "normal",
    fontSize: 10,
    textTransform: "uppercase",
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    borderColor: "#0B82DC",
    shadowColor: "#000000",
  } as ViewStyle,
  timer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    right: 12,
    width: "68%",
    textTransform: "uppercase",
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
  },
  btnWrapper: {
    display: "flex",
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 70,
  },
  cancelBtn: {
    flexDirection: "row",
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    right: 35,
  },
});
