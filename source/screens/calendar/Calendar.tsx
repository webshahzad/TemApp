//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { reactive } from "common/reactive";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  Text,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { standalone, Transaction } from "reactronic";
import {
  CalendarDisplayMode,
  CalendarManager,
} from "models/app/Calendar/CalendarManager";
import { RootStackPropsPerPath } from "navigation/params";
import { App } from "models/app/App";
import { DayGrid } from "./DayGrid";
import { MonthList } from "./MonthList";
import arrow from "assets/images/arrow.png";
import { Neomorph } from "react-native-neomorph-shadows";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icons from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { MorphShadow } from "components/MorphShadow";

export interface CalendarProps {
  manager: CalendarManager;
}

export function Calendar(
  p: StackScreenProps<RootStackPropsPerPath, "Calendar">
): JSX.Element {
  useEffect(() => {
    p.navigation.setOptions({ headerShown: false });
    return p.navigation.addListener("focus", () => {
      // void p.route.params.manager.reload()
    });
  }, []);
  const navigation = useNavigation();
  const dimension = Dimensions.get("screen").width;
  return reactive(() => {
    const manager = standalone(() =>
      Transaction.run(() => new CalendarManager())
    );

 
    return (
      <>
        <SafeAreaView style={styles.container}>
          <MorphShadow
            isSwapShadow
            shadowStyle={{
              backgroundColor: "#2e2e2e",
              width: dimension,
              shadowColor: "#fff",
              height: 70,
            }}
          >
            <View style={styles.header}>
              <Pressable
                style={styles.back}
                onPress={() => navigation.goBack()}
              >
                <Image source={arrow} />
              </Pressable>
              <Text style={styles.CalendarText}>THE TĒM APP</Text>

              {/* <HeaderRight buttons={[HeaderButton.globalSearch]} /> */}
              <TouchableOpacity
                onPress={() => p.navigation.navigate("GlobalSearch")}
                style={styles.search}
              >
                <Icons style={{ fontSize: 20, color: "#fff" }} name="search" />
              </TouchableOpacity>
            </View>
          </MorphShadow>

          {manager.displayMode === CalendarDisplayMode.Grid && (
            <DayGrid manager={manager} />
          )}
          {manager.displayMode === CalendarDisplayMode.List && (
            <MonthList manager={manager} />
          )}
        </SafeAreaView>
      </>
    );
  });
}

export function showCalendar(): void {
  const manager = standalone(() =>
    Transaction.run(() => new CalendarManager())
  );
  App.rootNavigation.push("Calendar", { manager });
}

const HeaderSize = 18;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
  },
  search: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e2e2e",
    borderColor: "white",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 8,
  },
  back: {
    margin: 10,
  },
  current: {
    borderWidth: 0,
    padding: 0,
    backgroundColor: "transparent",
  },
  title: {
    flex: 1,
  },
  headerText: {
    fontSize: HeaderSize,
  },
  action: {
    marginLeft: 15,
  },
  CalendarText: {
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
  },
});
