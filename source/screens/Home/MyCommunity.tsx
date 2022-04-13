import CircularProgress from "components/CircularProgress"
import { App } from "models/app/App"
import React, { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native"
import { Theme } from "components/Theme"
import {
  PersonalLeaderCard,
  PersonalLeaderList,
} from "screens/leaderboard/PersonalLeaderboard"
import { useNavigation } from "@react-navigation/native"

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
      <Text style={Theme.rightText}>MY COMMUNITY</Text>
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

          <View>
            <TouchableOpacity
              style={styles.newPost}
              onPress={handleViewProgress}
            >
              <Text style={styles.TematesText}>New Post</Text>
              <CircularProgress
                barWidth={1}
                trailColor="#C7D3CA"
                fill={value}
                strokeColor="#04FCF6"
                radius={22}
                styles={{ justifyContent: "center", alignItems: "center" }}
              ></CircularProgress>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={handleFeedProgress}

              style={styles.viewFeed}
            >
              <Text style={styles.TematesText2}>View Feed</Text>
              <CircularProgress
                barWidth={1}
                trailColor="#B620E0"
                fill={value}
                strokeColor="#F7B500"
                radius={22}
                styles={{ justifyContent: "center", alignItems: "center" }}
              ></CircularProgress>
            </TouchableOpacity>
          </View>
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
    width: 120,
    height: 233,
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
  newPost: {
    backgroundColor: "#3d3d3d",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignSelf: "flex-end",
    marginRight: 50,
    position: "absolute",
    bottom: 10,
    left: 20,

    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 18,
  },
  TematesText: {
    fontSize: 9,
    color: "#fff",
    position: "absolute",
    textAlign: "center",
    marginHorizontal: 13,
    width: "50%",
    borderColor: "#FFFFFF",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#ffff",
  },
  viewFeed: {
    backgroundColor: "#3d3d3d",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignSelf: "flex-end",
    marginRight: 50,
    position: "absolute",
    bottom: 90,
    left: 20,

    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 18,
  },
  TematesText2: {
    fontSize: 9,
    color: "#fff",
    position: "absolute",
    textAlign: "center",
    marginHorizontal: 13,
    width: "50%",
    borderColor: "#FFFFFF",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#ffff",
  },
  personal: {
    fontSize: 16,
    color: "#fff",
    margin: 5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#fff",
  },
})
