//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { Transaction, Ref } from "reactronic";
import { reactive } from "common/reactive";
import ImagePicker, { ImagePickerOptions } from "react-native-image-picker";
import { doAsync } from "common/doAsync";

import { App } from "models/app/App";
import { InputBadge } from "components/InputBadge";
import { RadioGroup, RadioButtonInfo } from "components/RadioGroup";
import {
  Gender,
  UserStatus,
  User,
  UserVerificationTarget,
} from "models/app/User";
import { DatePicker } from "components/DatePicker";
import { DatePickerManager } from "models/app/DatePickerManager";
import { PressableBadge } from "components/PressableBadge";
import { GymType } from "models/data/Address";
import { MainBlueColor } from "components/Theme";
import { formatShortDate } from "common/datetime";

const AvatarSize = 80;

export const GenderButtons: RadioButtonInfo[] = [
  {
    label: "FEMALE",
    value: Gender.Female,
  },
  {
    label: "MALE",
    value: Gender.Male,
  },
  {
    label: "OTHER",
    value: Gender.Other,
  },
];

export const GymButtons: RadioButtonInfo[] = [
  {
    label: "HOME GYM",
    value: GymType.Home,
  },
  {
    label: "OTHER",
    value: GymType.Other,
  },
];

export const ProfileInformation = (): React.ReactElement => {
  const birthdayManager = Transaction.run(
    () =>
      new DatePickerManager({
        model: Ref.to(App.user.edited).dateOfBirth,
        convertToString: true,
        format: formatShortDate,
      })
  );
  return reactive(() => {
    const user = App.user;
    const eu = Ref.to(user.edited);
    const addressModel = Ref.to(user.edited.address);
    const gymModel = Ref.to(user.edited.gymAddress);
    return (
      <View style={styles.container}>
        <Pressable
          style={styles.save}
          onPress={() => user.saveProfileChanges()}
        >
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
        <Pressable
          style={styles.avatarContainer}
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
            ImagePicker.showImagePicker(options, (response) =>
              doAsync(async () => {
                if (!response.didCancel && !response.error && response.uri) {
                  Transaction.run(
                    () => (user.edited.newProfilePicImage = response)
                  );
                }
              })
            );
          }}
        >
          <Image source={user.edited.getAvatar()} style={styles.avatar} />
        </Pressable>
        <InputBadge
          style={styles.input}
          label="First Name"
          icon="user"
          model={eu.first_name}
          labelBackgroundColor="white"
        />
        <InputBadge
          style={styles.input}
          label="Last Name"
          icon="user"
          model={eu.last_name}
          labelBackgroundColor="white"
        />
        <PressableBadge
          style={styles.input}
          label="Email"
          icon="envelope"
          text={eu.email}
          labelBackgroundColor="white"
          onPress={() =>
            App.rootNavigation.push("VerifyEmailPhone", {
              target: UserVerificationTarget.Email,
              initialValue: eu.email?.value,
            })
          }
        />
        {eu.status?.value === UserStatus.Verified && (
          <Text style={[styles.auxText, styles.verified]}>Email Verified</Text>
        )}
        <PressableBadge
          style={styles.input}
          label="Phone"
          icon="phone-alt"
          text={eu.phone}
          labelBackgroundColor="white"
          onPress={() =>
            App.rootNavigation.push("VerifyEmailPhone", {
              target: UserVerificationTarget.Phone,
              initialValue: eu.phone?.value,
            })
          }
        />
        <InputBadge
          style={styles.input}
          label="Username"
          icon="user"
          model={eu.username}
          labelBackgroundColor="white"
          buttons={[
            {
              icon: "redo",
              onPress: () =>
                Transaction.run(() => {
                  const suggestion = user.suggest.next();
                  if (suggestion) {
                    user.edited.username = suggestion;
                  }
                }),
            },
          ]}
        />
        <DatePicker
          label="Date of Birth"
          manager={birthdayManager}
          labelBackgroundColor="white"
        />
        <View style={[styles.radioGroup, styles.gender]}>
          <Text style={styles.radioLabel}>Gender</Text>
          <RadioGroup
            buttons={GenderButtons}
            model={eu.gender}
            horizontal
          ></RadioGroup>
        </View>
        <PressableBadge
          key={`UserLocation_${addressModel.place_id?.value}`} // for proper re-rendering TODO: fix
          style={styles.input}
          label="Location"
          icon="map-marker-alt"
          labelBackgroundColor="white"
          text={addressModel.formatted}
          onPress={() =>
            App.rootNavigation.push("SearchUserLocation", {
              manager: App.userLocationManager,
            })
          }
        />
        {gymModel.gymType.value === GymType.Other ? (
          <InputBadge
            style={styles.input}
            label="Gym/Club"
            icon="dumbbell"
            labelBackgroundColor="white"
            model={gymModel.name}
          />
        ) : (
          <PressableBadge
            key={`UserGym_${gymModel.gymInfo.value}`} // for proper re-rendering TODO: fix
            style={styles.input}
            label="Gym/Club"
            icon="dumbbell"
            labelBackgroundColor="white"
            text={gymModel.gymInfo}
            textStyle={{ paddingVertical: 4 }}
            onPress={() => App.rootNavigation.push("SearchGym")}
          />
        )}
        <View style={styles.radioGroup}>
          <RadioGroup
            buttons={GymButtons}
            model={gymModel.gymType}
            noValue={GymType.Gym}
            horizontal
          />
        </View>
      </View>
    );
  });
};

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "stretch",
    position: "relative",
  },
  save: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: MainBlueColor,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveText: {
    color: "white",
    textTransform: "uppercase",
  },
  avatarContainer: {
    alignSelf: "center",
  },
  avatar: {
    width: AvatarSize,
    height: AvatarSize,
    borderRadius: AvatarSize / 2,
    // margin: 20,
  },
  input: {
    marginBottom: 10,
  },
  radioGroup: {
    width: "100%",
    bottom: 10,
    paddingLeft: 20,
    // marginBottom: 15,
  },
  gender: {
    marginTop: 10,
  },
  radioLabel: {
    textTransform: "uppercase",
  },
  auxText: {
    width: "100%",
    textAlign: "right",
  },
  verified: {
    color: MainBlueColor,
  },
  genderTitle: {
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
    width: 287,
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    marginHorizontal: 30,
  },
});
