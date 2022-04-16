import { StackScreenProps } from "@react-navigation/stack";
import { Theme } from "components/Theme";
import { App } from "models/app/App";
import { RootStackPropsPerPath } from "navigation/params";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";
import { SimpleGradientProgressbarView } from "react-native-simple-gradient-progressbar-view";
import { ViewCalender } from "./ViewCalender";
import { UserActivityReport } from "../../models/data/UserReport";
import { reactive } from "common/reactive";
import { Transaction } from "reactronic";
import { moderateScale, scale } from "react-native-size-matters";

export function MySchedule(
  p: StackScreenProps<RootStackPropsPerPath, "MySchedule">
) {
  // React.useEffect(()=>{
  //   void user.loadProfileProperties()
  // },[])
  return reactive(() => {
    const user = App?.user;
    const account = user.accountabilityIndex;
    return (
      <View style={styles.container}>
        <Text style={styles.rightSideText}>My Schedule</Text>

        <View
          style={{
            width: "80%",
            height: "80%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{width: moderateScale(59), height: moderateScale(128), backgroundColor:'red'}}>
              <SimpleGradientProgressbarView
                style={{
                  width: '100%',
                  height: '100%',
                  borderColor: "#32C5FF",
                  borderWidth: 2,
                }}
                fromColor='#B620E0'
                toColor='#F7B500'
                // progress={(account != null) && account / 100}
                progress={1.0}

                maskedCorners={[1, 1, 1, 1]}
              />
            </View>
            <View>
              <Text></Text>
              <Text></Text>
              <Text></Text>
            </View>
          </View>
          <ViewCalender />
        </View>
      </View>
    );
  });
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "green",
    width: "100%",
    height: moderateScale(280),
    alignItems: "center",
    justifyContent: "center",
  },
  rightSideText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    position: "absolute",
    right: "-5%",
    top: "20%",
    transform: [{ rotate: "-90deg" }],
    color: "#0A64AA",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#fff",
    textAlign: "right",
  },
});
