//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from "react";
import { reactive } from "common/reactive";
import {
  View,
  StyleSheet,
  Text,
  ToastAndroid,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import {
  GenderButtons,
  GymButtons,
  styles as profileStyles,
} from "screens/profile/ProfileInformation";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackPropsPerPath } from "navigation/params";
import { RoundButton } from "components/RoundButton";
import { Hexagon } from "components/Hexagon/Hexagon";
import { MainBlueColor, Theme } from "components/Theme";
import { CellCustomization } from "components/Hexagon/HexagonProps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnFocus } from "common/useOnFocus";
import { App } from "models/app/App";
import { Api } from "models/app/Api";
import { doAsync } from "common/doAsync";
import { UserProfileCompletion } from "models/app/User";
import { ImageContainer } from "../../components/ImageContainer/ImageContainer";
import Splash from "assets/images/user-dummy2.png";
// import { Honeycomb, Hexagon } from 'react-honeycomb';

export const Interests: React.FunctionComponent<
  StackScreenProps<RootStackPropsPerPath, "Interests">
> = (p) => {
  const isFromSignUp: boolean = p.route.params.isFromSignUp;
  if (isFromSignUp) {
    useEffect(() => {
      // Store root stack navigation to access globally
      App.rootNavigation.set(p.navigation);
    }, []);
  }

  const applyLabel: string = isFromSignUp ? "SAVE & CONTINUE" : "UPDATE";
  const cancelLabel: string = isFromSignUp
    ? "CHOOSE INTERESTS LATER"
    : "CANCEL";

  const interests = App.interests;
  useOnFocus(p.navigation, async () => {
    await interests.reload();
    const userInterests = App.user.interest ?? [];
    interests.selectUserInterests(userInterests);
  });

  const close: () => void = isFromSignUp
    ? async () => {
        await App.user.updateProfileCompletionStatus(
          UserProfileCompletion.SelectInterests
        );
        void goToMainScreenWithTutorial();
      }
    : () => p.navigation.goBack();


  return reactive(() => {
    const cells: CellCustomization[] = App.interests.all.map((e, index) => ({

      content: {
        image: { uri: Api.serverUrl + e.icon },
        tintColor: "white",
        h2: e.name,
        h2size: 12,
        textColor: "white",
      },
      backgroundImage: { uri: Api.serverUrl + e.image },
      backgroundColor:
        (interests.isSelected(index) ? MainBlueColor : "#222222") + "B0",
      onPress: () => {
        interests.toggleInterest(index);
      },
    }));
    return (
      <SafeAreaView style={styles.screen}>
        <ImageContainer title="" goBack={false}>
          <ScrollView
            style={styles.scrollable}
            contentContainerStyle={styles.container}
          >
            <Text style={styles.text}>SELECT YOUR INTERESTS</Text>
            <View style={styles.hexContainer}>
              
              <Hexagon
                columns={3}
                rows={7}
                stroke="#303638"
                strokeWidth={2}
                cells={cells}
                spacing={5}
                backgroundColor={"none"}
                textColor="black"
                contentImageWidth={125}
              />
            </View>
            <View style={styles.buttons}>
              <RoundButton
                label="START YOUR JOURNEY"
                borderRadius={8}
                labelStyle={Theme.buttonText}
                vertical={12}
                horizontal={2}

                label={applyLabel}
                color="#0B82DC"
                background={"#FFFFFF"}
                style={styles.button}
                onPress={() =>
                  doAsync(async () => {
                    await updateInterests();
                    close();
                  })
                }
              />
              <RoundButton
                color="white"
                style={styles.button}
                onPress={() => {
                  close();
                }}
              />
            </View>
          </ScrollView>
        </ImageContainer>
      </SafeAreaView>
    );
  });
};

async function updateInterests(): Promise<void> {
  await App.interests.updateSelected();
  ToastAndroid.show("Interests updated", ToastAndroid.SHORT);
}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
    width: "100%",
  },
  scrollable: {
    width: "100%",
  },
  container: {
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    justifyContent: "space-between",
    flex: 1,
  },
  header: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    paddingVertical: 10,
  },
  text: {
    width: "100%",
    marginTop: "20%",
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
  },
  hexContainer: {
    display: "flex",
    justifyContent: "center",
    width: "60%",
  },
  buttons: {
    minWidth: "40%",
  },
  button: {
    marginTop: 20,
  },
});

async function goToMainScreenWithTutorial(): Promise<void> {
  await App.resetStartScreen();
  App.tutorial.show();
  App.rootNavigation.replace("Main");
}
function renderItem(item: string): React.ReactNode {
  throw new Error("Function not implemented.");
}
