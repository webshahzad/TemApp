import { toFixedPadded } from "common/number";
import { reactive } from "common/reactive";
import CircularProgress from "components/CircularProgress";
import { DialougeBoxComp } from "components/DialougeBox";
import { NavigationTabs } from 'components/NavigationTabs'
import { useNavigation } from '@react-navigation/native';
import { Theme } from "components/Theme";
import { App } from "models/app/App";
import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Shadow } from "react-native-shadow-2";

import { Transaction } from "reactronic";

export function MyHealth(): JSX.Element {
    const navigation = useNavigation();
  return reactive(() => {
    const activity =
      App.user.report.totalActivityReport.totalActivityScore.value !== undefined
        ? toFixedPadded(
            App.user.report.totalActivityReport.totalActivityScore.value,
            1,
            2
          )
        : undefined;
    return (
      <>
        <Text style={Theme.rightText}>My Health</Text>

        <View style={styles.outerCircle}>
          <Shadow radius={130}>
            <CircularProgress
              trailColor="gray"
              barWidth={50}
              fill={activity ? activity : 0}
              strokeColor="#04FCF6"
              styles={{ transform: [{ rotate: "180deg" }] }}
              radius={50}
            >
              <Pressable style={styles.innerCircle} onPress={()=>navigation.navigate("Reports")}>
                <View style={styles.innerText}>
                  <Text style={styles.score}>{activity ?? activity}</Text>
                  <Text style={styles.text}>Activity score</Text>
                </View>
              </Pressable>
            </CircularProgress>
          </Shadow>
        </View>

        <TouchableOpacity
          style={styles.journal}
          onPress={() => Transaction.run(() => {App.user.isJournal = true; App.user.dialogText="Comming Soon!"})}
        >
          <Text style={styles.journalText}>JOURNAL</Text>
          <CircularProgress
            barWidth={2}
            trailColor="#C7D3CA"
            fill={100}
            strokeColor="#04FCF6"
            radius={20}
            styles={{ justifyContent: "center", alignItems: "center" }}
          ></CircularProgress>
        </TouchableOpacity>
        
           <DialougeBoxComp onPress={()=>Transaction.run(() => (App.user.isJournal = false))}/>
      </>
    );
  });
}
const styles = StyleSheet.create({
  score: {
    fontSize: 38,
    color: "#FFFFFF",
    borderColor: "#0B82DC",
    fontWeight: "400",
    textShadowColor: "rgba(11,112,220,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#0B82DC",
  },
  text: {
    fontSize: 15,
    color: "#0B82DC",
    borderColor: "#FFFFFF",
    fontWeight: "600",
    textShadowColor: "rgba(240,240,255,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#FFFFFF",
  },
  innerText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  innerCircle: {
    width: 140,
    height: 140,
    backgroundColor: "#3d3d3d",
    borderRadius: 70,
    position: "absolute",
  },
  outerCircle: {
    width: 220,
    height: 220,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: "#0B82DC",
    borderStyle: "solid",
    borderRadius: 110,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.45,
    shadowOpacity: 0.29,
    elevation: -7,
  },
  outerCircle2: {
    width: 208,
    height: 208,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#04fcf670",
    borderStyle: "solid",
    borderRadius: 104,
    // marginTop: 45,
  },
  journal: {
    backgroundColor: "#3d3d3d",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignSelf: "flex-end",
    marginRight: 50,
    position: "absolute",
    bottom: 90,
    right: 1,
  },
  journalText: {
    fontSize: 7,
    color: "#fff",
    position: "absolute",
    textAlign: "center",
    width: "100%",
    borderColor: "#FFFFFF",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#ffff",
  },
});
