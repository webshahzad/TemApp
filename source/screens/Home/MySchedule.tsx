import { StackScreenProps } from "@react-navigation/stack"
import { Theme } from "components/Theme"
import { App } from "models/app/App"
import { RootStackPropsPerPath } from "navigation/params"
import React from "react"
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from "react-native"
import { SimpleGradientProgressbarView } from "react-native-simple-gradient-progressbar-view"
import { ViewCalender } from "./ViewCalender"
import { UserActivityReport } from "../../models/data/UserReport"
import { reactive } from "common/reactive"
import { Transaction } from "reactronic"

export function MySchedule(
  p: StackScreenProps<RootStackPropsPerPath, "MySchedule">
) {
  // React.useEffect(()=>{
  //   void user.loadProfileProperties()
  // },[])
  return reactive(() => {
    const user = App?.user
    const account = user.accountabilityIndex
    return (
      <>
        <Text style={Theme.rightText}>My Schedule</Text>
       

        <View
          style={{
            justifyContent: "space-around",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            // height: "100%",
            height: 400,
            zIndex: 1,
            // paddingBottom: 100


          }}
        >
         

            <View style={styles.outer}>
              <View style={styles.inner}>
                <SimpleGradientProgressbarView
                  style={styles.box}
                  fromColor="#B620E0"
                  toColor="#F7B500"
                  progress={account && account / 100}
                  maskedCorners={[1, 1, 1, 1]}
                />
              </View>

              <Pressable style={{ right: 30 }}>
                <Text style={styles.percent}>
                  {account ? `${account}%` : `0%`}
                </Text>
                <Pressable
                // onPress={() =>
                //   Transaction.run(() => (App.user.AccountabilityModel = true))
                // }
                >
                  <Text style={styles.account}>Accountability</Text>
                  <Text style={styles.index}>index</Text>
                </Pressable>
              </Pressable>
            </View>
         
         


          <ViewCalender />
        </View>

     

        {/* <Modal 
          style={styles.centeredView}
            animationType="slide"
            transparent={true}
            visible={App.user.AccountabilityModel}
            onRequestClose={() => {}}
          >
            <View style={styles.modalView}>
              <Text>Hello</Text>
            </View>
          </Modal> */}

      </>
    )
  })
}
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
const styles = StyleSheet.create({
  box: {
    width: 150,
    height: 50,
    borderColor: "#32C5FF",
    borderWidth: 2,
  },
  inner: {
    transform: [{ rotate: "270deg" }],
    backgroundColor: "#333",
    borderRadius: 3.2,
    width: 150,
    borderColor: "#0682DC",
    borderWidth: 7,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  outer: {
    width: "100%",
    height: (windowHeight / 100) * 50,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    top: -20,
    marginBottom:35,


  },
  percent: {
    color: "white",
    fontSize: 36,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#fff",
  },
  account: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#fff",
  },
  index: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#fff",
  },
  centeredView: {},
  modalView: {
    width: (windowWidth / 100) * 80,
    height: (windowHeight / 100) * 60,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    paddingTop: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    bottom: 40,
  },
})
