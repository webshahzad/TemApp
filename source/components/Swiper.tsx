import React from "react"
import { View, StyleSheet, Image, ActivityIndicator, Pressable, TouchableHighlight } from "react-native"
import Swiper from "react-native-swiper"
import onToggle from "assets/images/ontoggle.png"
import offToggle from "assets/images/offtoggle.png"
import { reactive } from "common/reactive"

const SwiperComp = (props: any) => {
  const [indexValue, setIndexValue] = React.useState()

  return reactive(() => {
    const RenderDot = ({ active }: any) => {
      if (active) {
        return (
          <View style={{ marginTop: 100 }}>
            <Image
              style={{ width: 20, height: 20, borderRadius: 10, margin: 3 }}
              source={onToggle}
            />
          </View>
        )
      }
      return (
        <Pressable style={{ marginTop: 100 }}>
          <Image
            style={{ width: 20, height: 20, borderRadius: 10, margin: 3 }}
            source={offToggle}
          />
        </Pressable>
      )
    }
    const handleIndex = (index: any) => {
      var label = ""
      var screen = ""
      var indexNumber = ""
      if (index === 0) {
        setIndexValue(index)
        screen = "SelectActivity"
        label = "ADD/TRACK ACTIVITY"
      } else if (index === 1) {
        setIndexValue(index)
        screen = "Calendar"
        label = "ADD EVENT"
        indexNumber = "1"
      } else if (index === 2) {
        setIndexValue(index)
        screen = "GoalsAndChallenges"
        label = "GOALS & CHALLENGES"
      } else if (index === 3) {
        setIndexValue(index)
        screen = "ChatList"
        label = "MESSAGES & TĒMS"
      }

      props.onChangeLabel(label, screen, indexNumber)
    }
    return (
      <TouchableHighlight style={{ height: 340 }}>
        <Swiper
          style={{}}
          height={200}
          loadMinimalSize={1}
          loadMinimalLoader={<ActivityIndicator color="#04FCF6" size={40} />}
          loadMinimal={true}
          onIndexChanged={(index) => {
            handleIndex(index)
          }}
          dot={<RenderDot />}
          activeDot={<RenderDot active />}
        >
          {props.children}
        </Swiper>
      </TouchableHighlight>
    )
  })
}

export default SwiperComp

const styles = StyleSheet.create({
  active: {
    backgroundColor: "#000000",
    shadowColor: "#000000",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  activeInner: {
    backgroundColor: "#04FCF6",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  inActive: {
    backgroundColor: "#000000",
    width: 18,
    height: 18,
    borderRadius: 9,
    borderColor: "#333",
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
})
