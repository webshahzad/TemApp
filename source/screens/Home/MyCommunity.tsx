import CircularProgress from "components/CircularProgress"
import { App } from "models/app/App"
import React, { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View, Platform, Dimensions, PixelRatio } from "react-native"
import { Theme } from "components/Theme"
import {
  PersonalLeaderCard,
  PersonalLeaderList,
} from "screens/leaderboard/PersonalLeaderboard"
import { useNavigation } from "@react-navigation/native"
import { moderateScale, scale } from "react-native-size-matters"
import { Shadow } from "react-native-shadow-2"


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

// based on iphone 5s's scale
const SCALE = SCREEN_WIDTH / 320

export function normalize(size) {
  const newSize = size * SCALE
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export function MyCommunity(): JSX.Element {
  const navigation = useNavigation()
  const stored = App?.leaderboard.stored

  const [value, setValue] = useState(0)
  const handleFeedProgress = () => {
    setValue(100)
    setTimeout(() => {
      navigation.navigate("Feed")

    }, 2000)
  }
  const handleViewProgress = () => {
    setValue(100)
    setTimeout(() => {
      navigation.navigate("ImageSelection")

    }, 2000)
  }
  return (
    <>
      <Text style={styles.rightSlidText}>MY COMMUNITY</Text>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={styles.main_view}>
            {stored && (
              <PersonalLeaderCard
                topScoreMember={stored.topScoreMember}
                myRank={stored.myRank}
              />
            )}
            <PersonalLeaderList />
          </View>

          <TouchableOpacity
            onPress={handleViewProgress}
            style={{
              position: "absolute",
              right: "-20%",
              bottom: "20%",
              overflow: "hidden",
              width: moderateScale(43),
              height: moderateScale(43),
              borderRadius: moderateScale(43),
              borderWidth: moderateScale(3),
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
                      fontSize: scale(6.0),
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
                    New Post
                  </Text>
                </View>
              </View>
            </Shadow>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFeedProgress}
            style={{
              position: "absolute",
              right: "-20%",
              bottom: "45%",
              overflow: "hidden",
              width: moderateScale(43),
              height: moderateScale(43),
              borderRadius: moderateScale(43),
              borderWidth: moderateScale(3),
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
                  trailColor="#B620E0"
                  fill={value}
                  strokeColor="#F7B500"
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
                      fontSize: scale(6.0),
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
                    View Feed
                  </Text>
                </View>
              </View>
            </Shadow>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.personal}>PERSONAL LEADERBOARD</Text>
        </View>
      </View>
    </>
  )
  // });
}
const styles = StyleSheet.create({
  main_view: {
    // width: 120,
    // height: 233,
    width: moderateScale(115), height: moderateScale(215),
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "#0682DC",
    borderRadius: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  // newPost: {
  //   backgroundColor: "#3d3d3d",
  //   width: 55,
  //   height: 55,
  //   borderRadius: 30,
  //   justifyContent: "center",
  //   alignSelf: "flex-end",
  //   marginRight: 50,
  //   position: "absolute",
  //   bottom: 10,
  //   left: 20,

  //   shadowColor: "#FFFFFF",
  //   shadowOffset: {
  //     width: 0,
  //     height: 6,
  //   },
  //   shadowOpacity: 0.37,
  //   shadowRadius: 7.49,
  //   elevation: 18,
  // },
  // TematesText: {
  //   fontSize: 9,
  //   color: "#fff",
  //   position: "absolute",
  //   textAlign: "center",
  //   marginHorizontal: 13,
  //   width: "50%",
  //   borderColor: "#FFFFFF",
  //   fontWeight: "600",
  //   textShadowColor: "rgba(0,0,0,5)",
  //   textShadowOffset: { width: -1, height: -1 },
  //   textShadowRadius: 10,
  //   shadowColor: "#ffff",
  // },
  // viewFeed: {
  //   backgroundColor: "#3d3d3d",
  //   width: 55,
  //   height: 55,
  //   borderRadius: 30,
  //   justifyContent: "center",
  //   alignSelf: "flex-end",
  //   marginRight: 50,
  //   position: "absolute",
  //   bottom: 90,
  //   left: 20,

  //   shadowColor: "#FFFFFF",
  //   shadowOffset: {
  //     width: 0,
  //     height: 6,
  //   },
  //   shadowOpacity: 0.37,
  //   shadowRadius: 7.49,
  //   elevation: 18,
  // },
  // TematesText2: {
  //   fontSize: 9,
  //   color: "#fff",
  //   position: "absolute",
  //   textAlign: "center",
  //   marginHorizontal: 13,
  //   width: "50%",
  //   borderColor: "#FFFFFF",
  //   fontWeight: "600",
  //   textShadowColor: "rgba(0,0,0,5)",
  //   textShadowOffset: { width: -1, height: -1 },
  //   textShadowRadius: 10,
  //   shadowColor: "#ffff",
  // },
  personal: {
    fontSize: scale(13),
    color: "#fff",
    margin: 5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#fff",
  },
  rightSlidText: {
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
  }
})
