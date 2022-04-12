//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  ToastAndroid,
  Alert,
} from "react-native";
import { Ref, Transaction } from "reactronic";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackPropsPerPath } from "navigation/params";
import { reactive } from "common/reactive";
import { DangerColor, Theme } from "components/Theme";
import { RoundButton } from "components/RoundButton";
import { App, StartScreen } from "models/app/App";
import { doAsync } from "common/doAsync";
import { RadioGroup } from "components/RadioGroup";
import {
  GenderButtons,
  GymButtons,
  styles as profileStyles,
} from "screens/profile/ProfileInformation";
import { GymType } from "models/data/Address";
import { DatePickerManager } from "models/app/DatePickerManager";
import ImagePicker, { ImagePickerOptions } from "react-native-image-picker";
import { WeightManager } from "models/app/WeightManager";
import { HeightManager } from "models/app/HeightManager";
import { RightHeaderPressableButton } from "navigation/utils";
import { UserProfileCompletion } from "models/app/User";
import { formatShortDate } from "common/datetime";
import { ImageContainer } from "../../components/ImageContainer/ImageContainer";
import CircularProgress from "../../components/CircularProgress";
import { InputComp } from "components/InputComp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Shadow } from "react-native-shadow-2";
import { WheelPickerProfile } from "components/WheelPickerLight";
import { DatePickerLight } from "components/DatePikerLight";
import Icon from "react-native-vector-icons/MaterialIcons";
interface IValidateObject {
  isName: boolean;
}

export function CreateProfile(
  p: StackScreenProps<RootStackPropsPerPath, "CreateProfile">
): JSX.Element {
  useEffect(() => {
    // Store root stack navigation to access globally
    App.rootNavigation.set(p.navigation);
  }, []);
  const [completion, setCompletion] = useState<number>(0);
     
  useEffect(() => {
    p.navigation.setOptions({
      headerRight: (props) =>
        RightHeaderPressableButton(
          "Skip",
          () =>
            doAsync(async () => {
              const isValid = App.user.edited.validate(); // sets isInvalid flag
              if (isValid) {
                await App.user.saveMandatoryProfileChanges();
                await App.user.updateProfileCompletionStatus(
                  UserProfileCompletion.CreateProfile
                );
                void goToInterestsScreen();
              }
            }),
          "gray"
        ),
    });
  }, []);

  const [birthdayManager] = React.useState(
    Transaction.run(
      () =>
        new DatePickerManager({
          model: Ref.to(App?.user.edited).dateOfBirth,
          convertToString: true,
          format: formatShortDate,
        })
    )
  );
  const [Weight] = React.useState(() =>
    Transaction.run(() => new WeightManager())
  );
  const [Height] = React.useState(Transaction.run(() => new HeightManager()));

  return reactive(() => {
    const user = App.user;
    const edited = user.edited;
    const eu = Ref.to(user.edited);
    const addressModel = Ref.to(user.edited.address);
    const gymModel = Ref.to(user.edited.gymAddress);
    const showInvalidUserName =
      edited.isInvalid && !edited.hasValidProfileUsername;
    const showInvalidDoB = edited.isInvalid && !edited.hasValidDateOfBirth;
    const showInvalidGymLocation =
      edited.isInvalid && !edited.hasValidGymLocation;
  
      return (
      <SafeAreaView style={Theme.screen}>
        <ImageContainer title="" goBack={false}>
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
              marginTop: 50,
            }}
          >
            <Pressable
              style={profileStyles.avatarContainer}
              onPress={() => {
                const options: ImagePickerOptions = {
                  title: "Select Avatar",
                  mediaType: "photo",
                  allowsEditing: true,
                  quality: 0.5,
                  storageOptions: {
                    skipBackup: true,
                    path: "images",
                  },
                };
                ImagePicker.showImagePicker(options, (response) => {
                  doAsync(async () => {
                    if (
                      !response.didCancel &&
                      !response.error &&
                      response.uri
                    ) {
                      Transaction.run(() => {
                        user.edited.newProfilePicImage = response;
                      });
                    }
                  });
                });
              }}
            >
              <View style={{ marginTop: 8 }}>
                <Shadow
                  radius={90}
                  viewStyle={{ justifyContent: "center", alignItems: "center" }}
                >
                  <View style={[styles.mainContainer]}>
                    <CircularProgress
                      trailColor="#000000b5"
                      fill={user.profilePercentage}
                      barWidth={5}
                      radius={50}
                      strokeColor="#04FCF6"
                      styles={false}
                    >
                      <View style={[styles.container]}>
                        <Image
                          source={user.edited.getAvatar()}
                          style={profileStyles.avatar}
                        />
                      </View>
                    </CircularProgress>
                  </View>
                </Shadow>
              </View>
            </Pressable>
            <View>
              <View style={Theme.section}>
                <InputComp
                  style={styles.input}
                  model={eu.username}
                  // onBlur={() => user.profilePercent()}
                  placeholder="USERNAME"
                  value={eu.username}
                  iconNameArr={["check-circle-outline", "error-outline"]}
                />
                <Text
                  style={[
                    styles.validationMessage,
                    {
                      color: showInvalidUserName ? DangerColor : "transparent",
                    },
                  ]}
                >
                  Please enter username
                </Text>
                <View style={styles.inputWithValidationWrapper}>
                  <DatePickerLight
                    onDateChange={(date: any) => {
                      birthdayManager.setValue(date);
                      Transaction.run(() => {
                        App.user.dateValue = date;
                      });
                      setCompletion(completion + 10);
                    }}
                    manager={birthdayManager}
                    label="Date of Birth"
                    labelBackgroundColor="grey"
                  />
                  <Icon
                    style={{ position: "absolute", right: 38, bottom: 50 }}
                    name={
                      App.user.dateValue
                        ? "check-circle-outline"
                        : "error-outline"
                    }
                    size={15}
                    color={App.user.dateValue ? "green" : DangerColor}
                  />
                  <Text
                    style={{
                      position: "absolute",
                      marginLeft: 100,
                      marginTop: 13,
                      fontSize: 10,
                      color: "#333",
                    }}
                  >
                    {App.user.dateValue}
                  </Text>
                  <Text
                    style={[
                      styles.validationMessage,
                      {
                        color: showInvalidDoB ? DangerColor : "transparent",
                        marginTop: 22,
                        marginLeft: 7,
                      },
                    ]}
                  >
                    Please select date of birth
                  </Text>
                </View>
                <View style={styles.inputWithValidationWrapper}>
                  <WheelPickerProfile
                    style={{ width: "100%" }}
                    manager={Height}
                    label="Height"
                    labelBackgroundColor="white"
                    icon="male"
                  />
                  <Icon
                    style={{ position: "absolute", right: 38, bottom: 35 }}
                    name= {App.user.edited.height.feet ? "check-circle-outline" : "error-outline"}
                    size={15}
                    color={App.user.edited.height.feet ? "green": DangerColor}
                  />
                </View>
                <View style={styles.inputWithValidationWrapper}>
                  <WheelPickerProfile
                    manager={Weight}
                    label="Weight"
                    labelBackgroundColor="white"
                    icon="weight"
                    style={styles.inputWithValidation}
                  />
                  <Icon
                    style={{ position: "absolute", right: 38, bottom: 35 }}
                    name={App.user.edited.weight ? "check-circle-outline" : "error-outline"}
                    size={15}
                    color={App.user.edited.weight ? "green": DangerColor}
                  />
                </View>
              </View>
              <View style={profileStyles.radioGroup}>
                <Text style={styles.gender}>Gender</Text>
                <RadioGroup
                  model={eu.gender}
                  buttons={GenderButtons}
                  horizontal
                ></RadioGroup>
              </View>

             <View>
             <InputComp
                style={styles.input}
                model={addressModel.formatted}
                onBlur={(data: any) => setCompletion(completion + 10)}
                onFocus={() => {
                  App.rootNavigation.push("SearchUserLocation", {
                    manager: App.userLocationManager,
                  });
                }}
                placeholder="LOCATION"
                iconNameArr={["check-circle-outline", "error-outline"]}
                errMsg="Please enter valid location"
              />
              <InputComp
                style={styles.input}
                model={gymModel.name}
                onFocus={() => App.rootNavigation.push("SearchGym")}
                key={`UserGym_${gymModel.gymInfo.value}`} // for proper re-rendering TODO: fix
                placeholder="GYM/CLUB"
                iconNameArr={["check-circle-outline", "error-outline"]}
              />
              <Text
                style={[
                  styles.validationMessage,
                  {
                    color: showInvalidGymLocation ? DangerColor : "transparent",
                    left: 20,
                  },
                ]}
              >
                Please select valid gym location
              </Text>
             </View>
              <View style={profileStyles.radioGroup}>
                <RadioGroup
                  buttons={GymButtons}
                  model={gymModel.gymType}
                  noValue={GymType.Gym}
                  horizontal
                  gym={true}
                />
              </View>

              <View style={[Theme.line, styles.Next]}>
                <RoundButton
                  color="#0B82DC"
                  background="#FFFFFF"
                  label="Next"
                  borderRadius={8}
                  vertical={12}
                  horizontal={2}
                  style={styles.Next}
                  labelStyle={Theme.buttonText}
                  onPress={async () => {
                    // validateFeild()
                    // const isValid = App.createProfileValidate(); // sets isInvalid flag
                    // try {
                    //   const isValid = edited.validate(); // sets isInvalid flag
                    // try {
                    const isValid = App.createProfileValidate(); // sets isInvalid flag

                    if (!isValid) {
                      try {
                        await user.saveProfileChanges();
                        await user.updateProfileCompletionStatus(
                          UserProfileCompletion.CreateProfile
                        );
                        void goToInterestsScreen();
                        ToastAndroid.show("success", ToastAndroid.SHORT);
                      } catch (e) {
                        ToastAndroid.show("error", ToastAndroid.SHORT);
                      }
                    }else{
                      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
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

async function goToInterestsScreen(): Promise<void> {
  await App.saveStartScreen(StartScreen.Interests);
  App.rootNavigation.replace("Interests", { isFromSignUp: true });
}
const shadow = {
  shadowColor: "rgba(0,0,0,0.5)",
  shadowRadius: 20,
  shadowOpacity: 0.6,
  shadowOffset: {
    width: -2,
    height: -2,
  },
};
const styles = StyleSheet.create({
  input: {
    marginBottom: 25,
    maxWidth: "100%",
  },
  inputWithValidation: {
    marginBottom: 5,
  },
  inputWithValidationWrapper: {
    marginBottom: 5,
  },
  Next: {
    minWidth: 128,
    borderRadius: 10.5,
    margin: 10,
  },
  mainContainer: {
    width: 135,
    height: 135,
    borderWidth: 6,
    borderRadius: 73,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#449dd4",
  },
  container: {
    width: 91,
    height: 91,
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderRadius: 45,
    borderColor: "#0b8cdc",
  },
  gender: {
    color: "#fff",
    marginHorizontal: 30,
    marginBottom: 5,
    width: 281,
    height: 16,
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#fff",
  },
  validationMessage: {
    color: DangerColor,
    fontSize: 12,
    left: 20,
    top: -20,
  },
});
