//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ToastAndroid } from "react-native";
import { Ref } from "reactronic";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackPropsPerPath } from "navigation/params";
import { reactive } from "common/reactive";
import { DangerColor, Theme } from "components/Theme";
import { RoundButton } from "components/RoundButton";
import { App, StartScreen } from "models/app/App";
import { UserProfileCompletion } from "models/app/User";
import { ImageContainer } from "../../components/ImageContainer/ImageContainer";
import CheckBoxComp from "components/CheckBoxComp";
import { InputComp } from "components/InputComp";

export function Login(
  p: StackScreenProps<RootStackPropsPerPath, "LogIn">
): JSX.Element {
  useEffect(() => {
    // Store root stack navigation to access globally
    App.rootNavigation.set(p.navigation);
  }, []);
    
  return reactive(() => {
    const su = Ref.to(App.user.stored);
    const showInvalidTUserName = App.isInvalid && !App.hasValidUsername;
    const showInvalidTPassword = App.isInvalid && !App.hasValidPassword;
    const u = Ref.to(App.user);
    const handleLogin=async () => {
      try {
        const isValid=  App.loginValidate(); // sets isInvalid flag

   if(isValid){ 
        await App.user.login();
        p.navigation.navigate("Main");
        ToastAndroid.show(
          "Login Successfully",
          ToastAndroid.SHORT
        );
      }
     } catch (e) {
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
      }
  
  }
    return (
      <SafeAreaView style={Theme.screen}>
        <ImageContainer title="log in" goBack={false}>
          <ScrollView 
            contentContainerStyle={styles.scrollView}
          >
            <View style={[Theme.section, { marginTop: "40%" }]}>
              <InputComp
                model={su.username}
                isError={App.lEmailErr}
                placeholder="EMAIL/MOBILE"
                iconNameArr={["check-circle-outline", "error-outline"]}
              />
               <Text
              style={[
                styles.validationMessage,
                { color: showInvalidTUserName ? DangerColor : "transparent" },
              ]}
            >
              Please enter username
            </Text>
            <View style={Theme.validationWrapper}>
              <InputComp
                model={u.password}
                isError={App.lPassErr}
                secured
                placeholder="Password"
                iconNameArr={["check-circle-outline", "error-outline"]}
              />
               <Text
              style={[
                styles.validationMessage,
                { color: showInvalidTPassword ? DangerColor : "transparent" },
              ]}
            >
              Please enter password
            </Text>
            </View>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  // height:10,
                }}
              >
                <CheckBoxComp model={u.isRemember} />
                <Text style={styles.remember}>REMEMBER ME</Text>
                    
              </View>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  right: 5,
                }}
              >
                <Text
                  style={styles.forgot}
                  onPress={() => p.navigation.push("ForgotPassword")}
                >
                  FORGOT PASSWORD?
                </Text>
              </View>
            </View>

            <View style={Theme.section}>
              <View style={[Theme.line, styles.loginButtonContainer]}>
                <RoundButton
                  color="#0B82DC"
                  background="#FFFFFF"
                  label="LOG IN"
                  borderRadius={8}
                  labelStyle={Theme.buttonTexts}
                  vertical={12}
                  horizontal={2}
                  style={styles.loginButton}
                  onPress={handleLogin}
                />
              </View>
              <View style={Theme.line}>
                <Text style={Theme.text}>Not a tēmate? </Text>
                <Text
                  style={Theme.link}
                  onPress={() => p.navigation.push("SignUp")}
                >
                  Sign up
                </Text>
              </View>
            </View>

            <View style={Theme.social}>
              {/* <View>
                <RoundButton
                  color="black"
                  background="#FFFFFF"
                  horizontal={44}
                  fontWeight={800}
                  vertical={6}
                  leftIcon="apple"
                  leftIconSize={20}
                  borderRadius={40}
                  label="Sign in with Apple"
                  style={styles.socialButtons}
                  onPress={async () => {
                    const nextScreen = await App.user.loginFacebook();
                    if (nextScreen !== null) {
                      await openNextScreen(nextScreen, p.navigation);
                    }
                  }}
                />
              </View> */}
              <View style={{ display: "flex", flexDirection: "row" }}>
                <RoundButton
                  color="#0B82DC"
                  background="#FFFFFF"
                  horizontal={24}
                  vertical={6}
                  rightIcon="facebook-square"
                  rightIconcolor="#0B82DC"
                  rightIconSize={20}
                  borderRadius={40}
                  label="Facebook"
                  style={styles.socialButton}
                  onPress={async () => {
                    const nextScreen = await App.user.loginFacebook();
                    if (nextScreen !== null) {
                      await openNextScreen(nextScreen, p.navigation);
                    }
                  }}
                />
                <RoundButton
                  color="tomato"
                  background="#FFFFFF"
                  rightIcon="google"
                  horizontal={34}
                  // vertical={3}
                  rightIconSize={20}
                  borderRadius={40}
                  rightIconcolor="tomato"
                  label="Google"
                  style={styles.socialButton}
                  onPress={async () => {
                    const nextScreen = await App.user.loginGoogle();
                    if (nextScreen !== null) {
                      await openNextScreen(nextScreen, p.navigation);
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
  socialButton: {
    margin: 15,
    height:34,
    borderRadius:17,
  
  },
  socialButtons:{
  width:286,
  marginLeft:15,
  height:34,
  },
  input: {
    borderWidth: 0,
    maxWidth: "100%",
  },
  loginButtonContainer: {
    marginBottom: 15,
  },
  loginButton: {
    minWidth: 128,
    borderRadius: 10.5,
    marginTop: 20,
    height:41,
  },
  remember: {
    color: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 0,
    fontSize: 10,
    right: 10,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#FFFFFF",
    letterSpacing: 1,
  },
  forgot: {
    color: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 0,
    fontSize: 10,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#FFFFFF",
    letterSpacing: 1,
  },
  scrollView:{
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  validationMessage: {
    color: DangerColor,
    fontSize: 12,
    left: 20,
    top:-20
  },
});

async function openNextScreen(
  nextScreen: UserProfileCompletion,
  navigation: StackNavigationProp<RootStackPropsPerPath, "LogIn">
): Promise<void> {
  switch (nextScreen) {
    case UserProfileCompletion.NotDone:
      await App.saveStartScreen(StartScreen.CreateProfile); // save state to open on App restart
      navigation.replace("CreateProfile");
      break;
    case UserProfileCompletion.CreateProfile:
      await App.saveStartScreen(StartScreen.Interests);
      navigation.replace("Interests", { isFromSignUp: true });
      break;
    case UserProfileCompletion.SelectInterests:
      navigation.replace("Main");
      break;
  }
}
