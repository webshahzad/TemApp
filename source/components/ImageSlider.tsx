import { reactive } from "common/reactive"
import { App } from "models/app/App"
import React from "react"
import { StyleSheet, Text, View, Image, ScrollView, Pressable } from "react-native"
import Image1 from "assets/slicing/Rectangle1/image1.png"
import Image2 from "assets/slicing/Rectangle2/image2.png"
import TemTv from "assets/TemTv.png"
import Image4 from "assets/slicing/Rectangle4/image4.png"
import Image5 from "assets/slicing/Rectangle5/image5.png"
import Ride from "assets/slicing/Rectangle4/Ride.png"
import seeAll from "assets/images/seeall.png"
import { TouchableOpacity } from "react-native-gesture-handler"
import { StackScreenProps } from "@react-navigation/stack"
import { RootStackPropsPerPath } from "navigation/params"
import { useNavigation } from "@react-navigation/native"
import { Transaction } from 'reactronic'
import { DialougeBoxComp } from './DialougeBox'

export function ImageSlider(
  p: StackScreenProps<RootStackPropsPerPath, "ContentScreen">
): JSX.Element {
  const navigation = useNavigation()

  return reactive(() => {
    const user = App.user.report.totalActivityReport.totalActivityScore
    return (
      <View style={{ marginBottom: 10, position: "absolute", bottom: 0 }}>
        <View style={styles.maincontainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ContentScreen")}
          >
            <Image
              style={{ width: 70, height: 15 }}
              source={seeAll}
            />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Pressable style={styles.imgView} onPress={() => navigation.navigate("Notifications")}>
              <View styles={styles.mainNotifications}>
                <Text style={styles.Notifications}>{App.user.stored.unreadNotiCount}</Text>
                <Image style={styles.images} source={Image2} />
              </View>
            </Pressable >
            <Pressable style={styles.imgView}
              onPress={() => Transaction.run(() => { App.user.isJournal = true; App.user.dialogText = "Join the Ride like MADD Florida Challenge when it opens on April 4th" })}>
              <Image style={styles.images} source={Ride} />
            </Pressable>
            <Pressable style={styles.imgView}
              onPress={() => Transaction.run(() => { App.user.isJournal = true; App.user.dialogText = "Comming Soon!" })}>
              <Image style={styles.images} source={Image1} />
            </Pressable>

            <Pressable style={styles.imgView}
              onPress={() => Transaction.run(() => { App.user.isJournal = true; App.user.dialogText = "Comming Soon!" })}>
              <Image style={styles.images} source={TemTv} />
            </Pressable>
            <Pressable style={styles.imgView}
              onPress={() => navigation.navigate("GoalsAndChallenges")}>
              <Image style={styles.images} source={Image4} />
            </Pressable>
            {/* <Pressable style={styles.imgView}>
              <Image style={styles.images} source={Image5} />
            </Pressable> */}
          </View>
        </ScrollView>
        <DialougeBoxComp onPress={() => Transaction.run(() => (App.user.isJournal = false))} />
      </View>
    )
  })
}
const styles = StyleSheet.create({
  maincontainer: {
    justifyContent: "center",
    alignSelf: "flex-end",
    marginRight: 20,
  },
  images: {
    width: 140,
    height: 90,
  },
  Seeall: {
    color: "#FFFF",
    fontSize: 16,
  },
  imgView: {
    marginHorizontal: 10,
    marginTop: 10
  },
  mainNotifications: {
    position: 'relative',
    paddingTop: 20,
    flexDirection: 'row',
    margin: 5,

  },
  Notifications: {
    position: "absolute",
    top: -10,
    right: -8,
    // padding: 5,
    borderRadius: 50,
    backgroundColor: "#AF1C1C",
    color: 'white',
    zIndex: 1,
    width: 20,
    height: 20,
    fontSize: 7,
    textAlignVertical: 'center',
    textAlign: "center",
    //  paddingHorizontal:3,
    justifyContent: 'center'
    //  paddingLeft:3,
  },
})
