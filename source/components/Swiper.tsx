/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
  TouchableHighlight,
  ImageSourcePropType,
} from 'react-native'
import Swiper from 'react-native-swiper'
import onToggle from 'assets/images/ontoggle.png'
import offToggle from 'assets/images/offtoggle.png'
import { reactive } from 'common/reactive'
import { moderateScale } from 'react-native-size-matters'

interface IsIndicatorProps {
  img: ImageSourcePropType;
}

const Indicator = (props: IsIndicatorProps) => {
  return (
    <View>
      <Image style={styles.indicatorImg} source={props.img} />
    </View>
  )
}

const SwiperComp = (props: any) => {
  const [indexValue, setIndexValue] = React.useState()

  return reactive(() => {
    const RenderDot = ({ active }: any) => {
      if (active) {
        return <Indicator img={onToggle} />
      }
      return <Indicator img={offToggle} />
    }

    const handleIndex = (index: any) => {
      var label = ''
      var screen = ''
      var indexNumber = ''
      if (index === 0) {
        setIndexValue(index)
        screen = 'SelectActivity'
        label = 'ADD/TRACK ACTIVITY'
      } else if (index === 1) {
        setIndexValue(index)
        screen = 'Calendar'
        label = 'ADD EVENT'
        indexNumber = '1'
      } else if (index === 2) {
        setIndexValue(index)
        screen = 'GoalsAndChallenges'
        label = 'GOALS & CHALLENGES'
      } else if (index === 3) {
        setIndexValue(index)
        screen = 'ChatList'
        label = 'MESSAGES & TĒMS'
      }

      props.onChangeLabel(label, screen, indexNumber)
    }
    return (
      <View style={styles.container}>
        <Swiper
          loadMinimalSize={1}
          loadMinimalLoader={<ActivityIndicator color='#04FCF6' size={40} />}
          loadMinimal
          onIndexChanged={index => {
            handleIndex(index)
          }}
          dot={<RenderDot />}
          activeDot={<RenderDot active />}
        >
          {props.children}
        </Swiper>
      </View>
    )
  })
}

export default SwiperComp

const styles = StyleSheet.create({
  container: { height: moderateScale(340) },
  indicatorImg: {
    width: moderateScale(20),
    height: moderateScale(20),
    marginHorizontal: moderateScale(3),
    resizeMode: 'contain',
  },
})
