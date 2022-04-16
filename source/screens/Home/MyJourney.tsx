import React from "react"
import { Theme } from "components/Theme"
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from "react-native"
import { Ref } from "reactronic"
import { App } from "models/app/App"
import { styles as profileStyles } from "screens/profile/ProfileInformation"
import { FindTemates } from "components/FindTemates"
import { useNavigation } from "@react-navigation/native"
import { LinearTextGradient } from "react-native-text-gradient"
import { Neomorph } from 'react-native-neomorph-shadows'

export function MyJourney() {
  const user = App?.user
  const accountMission = App?.user.stored.accountabilityMission
  const navigation = useNavigation()
  const eu = Ref.to(user?.edited)
  const userDetail = eu._id.owner
  const windowWidth = Dimensions.get("window").width
  const windowHeight = Dimensions.get("window").height
  return (
    <>
      <Text style={[Theme.rightText]}>MY JOURNEY</Text>
      <View
        style={{

          width: "100%",
          height: 250,
          marginTop: 20,


        }}>
        <View style={styles.accountBilityText}>
          <Text
            style={{
              color: "#fff",
              fontSize: 10,
              marginBottom: 10,
              marginLeft: 3,
              textShadowColor: "rgba(0,0,0,0.5)",
              textShadowOffset: { width: -1, height: -1 },
              textShadowRadius: 5,
              shadowColor: "#fff",

            }}
          >
            ACCOUNTABILITY MISSION
          </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Neomorph
            inner // <- enable shadow inside of neomorph
            style={{
              backgroundColor: "#3E3E3E",
              shadowRadius: 1,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 4, height: 4 },
              elevation: 2,
              width: (windowWidth / 100) * 70,
              height: (windowHeight / 100) * 13,
            }}
          >

            <View style={{ marginTop: 18, marginLeft: 10 }}>
              <LinearTextGradient
                style={{
                  fontWeight: "bold",
                  textShadowColor: "rgba(0,0,0,0.5)",
                  textShadowOffset: { width: -1, height: -1 },
                  textShadowRadius: 10,
                  shadowColor: "#fff",
                  width: 100,
                }}
                locations={[0, 1, 2]}
                colors={["#F7B500", "#B620E0", "#32C5FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={{ color: "#fff", fontSize: 14, width: 200 }}>{accountMission}</Text>
              </LinearTextGradient>
            </View>
          </Neomorph>

        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            // marginHorizontal: 70
            justifyContent: 'center',
            alignItems: 'center',
            width: (windowWidth / 100) * 80,

          }}
        >
          <TouchableOpacity
            style={{ marginTop: 30 }}
            onPress={() => {
              navigation.navigate("ProfileTemates")
            }}
          >
            <Text style={styles.id_text}>{userDetail.first_name}</Text>
            <Text style={styles.id_text}>@{userDetail.username}</Text>
            <Text style={{ color: "#fff", fontSize: 10, width: "60%" }}>
              {userDetail.location}
            </Text>
          </TouchableOpacity>
          <View style={{ marginTop: 20, marginLeft: 10 }}>
            <Pressable
              style={profileStyles.avatarContainer}
              onPress={() => {
                navigation.navigate("ProfileTemates")
              }}
            >
              <View style={[styles.mainContainer]}>
                <Image
                  source={user.edited.getAvatar()}
                  style={profileStyles.avatar}
                />
              </View>
            </Pressable>
          </View>
          <View style={styles.findTemates}>
            <FindTemates />
          </View>
        </View>
      </View>
    </>
  )
  // });
}
const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 6,
    borderRadius: 73,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#0682DC",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 15,
  },
  text: {
    borderColor: "#FFFFFF",
    fontSize: 14,
    color: "white",
    textShadowColor: "rgba(240,240,255,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#FFFFFF",
  },
  id_text: {
    color: "#fff",
    fontSize: 10,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#fff",
  },
  findTemates: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 50
  },
  accountBilityText: {
    left: 60,
  }
})
