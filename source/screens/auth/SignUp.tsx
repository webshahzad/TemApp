//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { Ref, Transaction } from "reactronic";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackPropsPerPath } from "navigation/params";
import { reactive } from "common/reactive";
import { DangerColor, Theme } from "components/Theme";
import { RoundButton } from "components/RoundButton";
import { App } from "models/app/App";
import { Api } from "models/app/Api";
import { ImageContainer } from "../../components/ImageContainer/ImageContainer";
import PhoneInput from "react-native-phone-number-input";
import { InputComp } from "components/InputComp";
import CheckBoxComp from "components/CheckBoxComp";

export function SignUp(
  p: StackScreenProps<RootStackPropsPerPath, "LogIn">
): JSX.Element {
  const su = Ref.to(App.user.stored);
  const u = Ref.to(App.user);

  return reactive(() => {
    const showInvalidFirstName = App.isInvalid && !App.hasValidfirstName;
    const showInvalidLastName = App.isInvalid && !App.hasValidlastName;
    const showInvalidEmail = App.isInvalid && !App.hasValidsignupEmail;
    const showInvalidPhone = App.isInvalid && !App.hasValidsignupPhone;
    const showInvalidPass = App.isInvalid && !App.hasValidsignupPass;

    return (
      <SafeAreaView style={Theme.screen}>
        <ImageContainer title="Sign Up" goBack>
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
            }}
            keyboardShouldPersistTaps={false}
            keyboardDismissMode="on-drag"
          >
            <View style={{ ...Theme.section, marginTop: "12%" }}>
              <InputComp
                model={su.first_name}
                isError={App.sFnameErr}
                placeholder="FIRST NAME"
                value={su.first_name}
                iconNameArr={["check-circle-outline", "error-outline"]}
              />
              <Text
                style={[
                  styles.validationMessage,
                  { color: showInvalidFirstName ? DangerColor : "transparent" },
                ]}
              >
                Please enter first name
              </Text>
              <View style={Theme.validationWrapper}>
                <InputComp
                  model={su.last_name}
                  isError={App.sLnameErr}
                  placeholder="LAST NAME"
                  value={su.last_name}
                  iconNameArr={["check-circle-outline", "error-outline"]}
                />
                <Text
                  style={[
                    styles.validationMessage,
                    {
                      color: showInvalidLastName ? DangerColor : "transparent",
                    },
                  ]}
                >
                  Please enter last name
                </Text>
              </View>
              <View style={Theme.validationWrapper}>
                <InputComp
                  model={su.email}
                  isError={App.sEmailErr}
                  placeholder="EMAIL"
                  value={su.email}
                  iconNameArr={["check-circle-outline", "error-outline"]}
                />
                <Text
                  style={[
                    styles.validationMessage,
                    { color: showInvalidEmail ? DangerColor : "transparent" },
                  ]}
                >
                  Please enter email
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: 35,
                  marginBottom: 15,
                  marginTop: 15,
                }}
              >
                <View style={Theme.validationWrapper}>
                  <View style={{ width: "100%" }}>
                    <PhoneInput 
                      defaultValue={su.phone.value} 
                      placeholder="PHONE NUMBER"
                      layout="second"
                      onChangeText={(value) => {
                        Transaction.run(() => {
                          if (su.phone) {
                            su.phone.value = value;
                          } else {
                            su.phone.value = value;
                          }
                        });
                      }}
                      textInputStyle={{ fontSize: 10 }}
                      containerStyle={{
                        borderRadius: 50,
                        width: "100%",
                        height: 35,
                      }}
                      codeTextStyle={{ fontSize: 10 }}
                      onChangeCountry={(value) => {
                        Transaction.run(() => {
                          if (value)
                            su.country_code.value = `+${value.callingCode[0]}`;
                        });
                      }}
                      countryPickerButtonStyle={{ marginRight: -25 }}
                      flagButtonStyle={{ marginHorizontal: -10 }}
                      textContainerStyle={{
                        paddingVertical: 0,
                        backgroundColor: "#fff",
                        borderRadius: 50,
                      }}
                    />
                    <Text
                      style={[
                        styles.validationMessage,
                        {
                          color: showInvalidPhone ? DangerColor : "transparent",
                          top: 10,
                        },
                      ]}
                    >
                      Please enter phone number
                    </Text>
                  </View>
                </View>
              </View>
              <View style={Theme.validationWrapper}>
                <InputComp
                  model={u.password}
                  isError={App.sPassErr}
                  placeholder="PASSWORD"
                  secured
                  value={u.password}
                  iconNameArr={["check-circle-outline", "error-outline"]}
                />
                <Text
                  style={[
                    styles.validationMessage,
                    {
                      color: showInvalidPass ? DangerColor : "transparent",
                      width: 250,
                      display: showInvalidPass ? "flex" : "none",
                    },
                  ]}
                >
                  Please enter password between 8 to 16 characters Your password
                  should include atleast one uppercase number and special
                  character
                </Text>
              </View>
            </View>

            <View style={Theme.section}>
              <View style={styles.policiesToggle}>
                <Text style={styles.policyText}>I agree with the </Text>
                <Text style={Theme.link} onPress={showTermsOfUse}>
                  terms of use
                </Text>
                <Text style={styles.policyText}> and </Text>
                <Text style={Theme.link} onPress={showPrivacyPolicy}>
                  privacy policy
                </Text>
                <CheckBoxComp model={u.acceptedTermsAndCondition} />
              </View>
            </View>

            <View style={styles.button}>
              <RoundButton
              style={{width:126}}
                color="#0B82DC"
                background="#FFFFFF"  
                label="SIGN UP"
                borderRadius={8}
                vertical={12}
                labelStyle={Theme.buttonTexts}
                horizontal={23}
                onPress={
                  u.acceptedTermsAndCondition.value
                    ? async () => {
                        const isValid = App.signupValidate();
                        if (isValid) {
                          if (!su.country_code.value) {
                            ToastAndroid.show(
                              "Please select country code",
                              ToastAndroid.SHORT
                            );
                          } else {
                            try {
                              await App.user.signUp();
                              p.navigation.push("OtpVerification", {
                                context: "signUp",
                              });
                            } catch (e) {
                              ToastAndroid.show(e.message, ToastAndroid.SHORT);
                            }
                          }
                        }
                      }
                    : () =>
                        ToastAndroid.show(
                          "Please accept our terms and conditions",
                          ToastAndroid.SHORT
                        )
                }
              />
            </View>
          </ScrollView>
        </ImageContainer>
      </SafeAreaView>
    );
  });
}

function showTermsOfUse(): void {
  App.rootNavigation.push("WebPage", {
    title: "Terms and Conditions",
    source: {
      uri: Api.apiUrl + "/termsConditions",
    },
  });
}

function showPrivacyPolicy(): void {
  App.rootNavigation.push("WebPage", {
    title: "Privacy Policy",
    source: {
      uri: Api.apiUrl + "/privacy_policy",
    },
  });
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 15,
  },
  policiesToggle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:30
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop:40,
    marginBottom:40
  },
  policyText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 8,
    textTransform: "uppercase",
    paddingVertical: 0,
  },
  validationMessage: {
    color: DangerColor,
    fontSize: 12,
    left: 20,
    top: -20,
  },
});
