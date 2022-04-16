import { toFixedPadded } from "common/number";
import { reactive } from "common/reactive";
import CircularProgress from "components/CircularProgress";
import { DialougeBoxComp } from "components/DialougeBox";
import { NavigationTabs } from "components/NavigationTabs";
import { useNavigation } from "@react-navigation/native";
import { Theme } from "components/Theme";
import { App } from "models/app/App";
import React from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  PixelRatio,
} from "react-native";
import { Shadow } from "react-native-shadow-2";

import { Transaction } from "reactronic";
import { moderateScale, scale } from "react-native-size-matters";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// based on iphone 5s's scale
const SCALE = SCREEN_WIDTH / 320;

export function normalize(size) {
  const newSize = size * SCALE;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

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
      <View style={styles.container}>
        <Text style={styles.rightSideText}>My Health</Text>
        <Shadow>
          <View style={styles.circularProgressOuter}>
            <View style={styles.circularProgressInner}>
              <CircularProgress
                trailColor='gray'
                barWidth={moderateScale(25)}
                fill={activity ? activity : 0}
                strokeColor='#04FCF6'
                styles={{ transform: [{ rotate: "180deg" }] }}
                radius={moderateScale(60)}
                strokeThickness={4}
              />
              <View
                style={{
                  width: "75%",
                  height: "75%",
                  position: "absolute",
                  backgroundColor: "#3d3d3d",
                  borderRadius:
                    Math.round(
                      Dimensions.get("window").width +
                        Dimensions.get("window").height
                    ) / 2,
                  shadowOffset: {
                    width: -6,
                    height: -4,
                  },
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <Text style={styles.scoreText}>{activity ?? activity}</Text>
                <Text style={styles.acitivityText}>Activity score</Text>
              </View>
            </View>
          </View>
        </Shadow>
        <View
          style={{
            position: "absolute",
            right: "20%",
            bottom: "10%",
            overflow: "hidden",
            width: moderateScale(40),
            height: moderateScale(40),
            borderRadius: moderateScale(40),
            borderWidth: moderateScale(2),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#3d3d3d",
            borderColor: "#3d3d3d",
          }}
        >
          <Shadow
            radius={moderateScale(1)}
            containerViewStyle={{ overflow: "hidden" }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CircularProgress
                barWidth={moderateScale(0.5)}
                radius={moderateScale(16)}
                trailColor='#C7D3CA'
                fill={100}
                strokeColor='#04FCF6'
              />
              <View
                style={{
                  position: "absolute",
                  width: "70%",
                  height: "70%",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: scale(3.5),
                    color: "#0682DC",
                    position: "absolute",
                    textAlign: "center",
                    width: "100%",
                    borderColor: "#FFFFFF",
                    fontWeight: "500",
                    textShadowColor: "rgba(0,0,0,5)",
                    textShadowOffset: { width: -1, height: -1 },
                    textShadowRadius: 10,
                    shadowColor: "#ffff",
                  }}
                >
                  JOURNAL
                </Text>
              </View>
            </View>
          </Shadow>
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
    fontSize:10,
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
 
  },
  circularProgressOuter: {
    borderRadius:
      Math.round(
        Dimensions.get("window").width + Dimensions.get("window").height
      ) / 2,
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: moderateScale(10),
    borderColor: "#0B82DC",
    borderStyle: "solid",
    shadowColor: "#000",
    shadowOffset: {
      width: -8,
      height: -10,
    },
    shadowRadius: 3.45,
    shadowOpacity: 0.29,
    elevation: -10,
    overflow: "hidden",
  },
  circularProgressInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  scoreText: {
    fontSize: normalize(22),
    color: "#FFFFFF",
    borderColor: "#0B82DC",
    fontWeight: "400",
    textShadowColor: "rgba(11,112,220,0.5)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#0B82DC",
  },
  acitivityText: {
    fontSize: normalize(8),
    color: "#0B82DC",
    borderColor: "#FFFFFF",
    fontWeight: "500",
    textShadowColor: "rgba(240,240,255,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#FFFFFF",
    textTransform: "uppercase",
  },
});

// export function MyHealth(): JSX.Element {
//     const navigation = useNavigation();
//   return reactive(() => {
//     const activity =
//       App.user.report.totalActivityReport.totalActivityScore.value !== undefined
//         ? toFixedPadded(
//             App.user.report.totalActivityReport.totalActivityScore.value,
//             1,
//             2
//           )
//         : undefined;
//     return (
//       <>
//         <Text style={Theme.rightText}>My Health</Text>

//         <View style={styles.outerCircle}>
//           <Shadow radius={130}>
//             <CircularProgress
//               trailColor="gray"
//               barWidth={50}
//               fill={activity ? activity : 0}
//               strokeColor="#04FCF6"
//               styles={{ transform: [{ rotate: "180deg" }] }}
//               radius={50}
//             >
//               <Pressable style={styles.innerCircle} onPress={()=>navigation.navigate("Reports")}>
//                 <View style={styles.innerText}>
//                   <Text style={styles.score}>{activity ?? activity}</Text>
//                   <Text style={styles.text}>Activity score</Text>
//                 </View>
//               </Pressable>
//             </CircularProgress>
//           </Shadow>
//         </View>

//         <TouchableOpacity
//           style={styles.journal}
//           onPress={() => Transaction.run(() => {App.user.isJournal = true; App.user.dialogText="Comming Soon!"})}
//         >
//           <Text style={styles.journalText}>JOURNAL</Text>
//           <CircularProgress
//             barWidth={2}
//             trailColor="#C7D3CA"
//             fill={100}
//             strokeColor="#04FCF6"
//             radius={20}
//             styles={{ justifyContent: "center", alignItems: "center" }}
//           ></CircularProgress>
//         </TouchableOpacity>
//            <DialougeBoxComp onPress={()=>Transaction.run(() => (App.user.isJournal = false))}/>
//       </>
//     );
//   });
// }
// const styles = StyleSheet.create({
//   score: {
//     fontSize: 38,
//     color: "#FFFFFF",
//     borderColor: "#0B82DC",
//     fontWeight: "400",
//     textShadowColor: "rgba(11,112,220,0.5)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 10,
//     shadowColor: "#0B82DC",
//   },
//   text: {
//     fontSize: 15,
//     color: "#0B82DC",
//     borderColor: "#FFFFFF",
//     fontWeight: "600",
//     textShadowColor: "rgba(240,240,255,0.2)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 10,
//     shadowColor: "#FFFFFF",
//   },
//   innerText: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100%",
//   },
//   innerCircle: {
//     width: 140,
//     height: 140,
//     backgroundColor: "#3d3d3d",
//     borderRadius: 70,
//     position: "absolute",
//   },
//   outerCircle: {
//     width: 220,
//     height: 220,
//     alignSelf: "center",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 8,
//     borderColor: "#0B82DC",
//     borderStyle: "solid",
//     borderRadius: 110,
//     marginTop: 15,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowRadius: 3.45,
//     shadowOpacity: 0.29,
//     elevation: -7,
//   },
//   outerCircle2: {
//     width: 208,
//     height: 208,
//     alignSelf: "center",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 3,
//     borderColor: "#04fcf670",
//     borderStyle: "solid",
//     borderRadius: 104,
//     // marginTop: 45,
//   },
//   journal: {
//     backgroundColor: "#3d3d3d",
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignSelf: "flex-end",
//     marginRight: 50,
//     position: "absolute",
//     bottom: 90,
//     right: 1,
//   },
//   journalText: {
//     fontSize: 7,
//     color: "#fff",
//     position: "absolute",
//     textAlign: "center",
//     width: "100%",
//     borderColor: "#FFFFFF",
//     fontWeight: "600",
//     textShadowColor: "rgba(0,0,0,5)",
//     textShadowOffset: { width: -1, height: -1 },
//     textShadowRadius: 10,
//     shadowColor: "#ffff",
//   },
// });
