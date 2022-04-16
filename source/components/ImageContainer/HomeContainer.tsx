import React, { PropsWithChildren } from 'react'
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native'
import { reactive } from 'common/reactive'
import HomeBg from 'assets/images/homeBackground.jpeg'
import { useNavigation } from '@react-navigation/native'
import { ImageSlider } from 'components/ImageSlider'
import { HeaderRight, HeaderButton } from 'components/HeaderRight'
import Hexagon from 'components/Hexagon'
import { MainBlueColor, Theme } from 'components/Theme'
import { openEditEvent } from 'screens/calendar/Events'
import BigBlue from 'assets/images/BigBlue.png'

import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters'

interface ModalProps {
  slider: boolean;
  hexagonText: string;
  screenName: string;
  indexNumber: string | number;
}
const windowWidth = Dimensions.get('window').width

export function HomeContainer({
  children,
  slider,
  hexagonText,
  screenName,
  indexNumber,
}: PropsWithChildren<ModalProps>): JSX.Element {
  const navigation = useNavigation()

  return (
    <ScrollView>
      <ImageBackground
        source={HomeBg}
        resizeMode='stretch'
        style={{ width: '100%', height: moderateScale(896) }}
      >
        <View
          style={{
            width: '100%',
            height: moderateScale(700),
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '100%',
              height: moderateScale(600),
              backgroundColor: MainBlueColor,
            }}
          >
            <Text style={styles.headerTitle}>THE TĒM APP</Text>
            <HeaderRight buttons={[HeaderButton.globalSearch]} />

            <View style={{ paddingTop: moderateScale(60)}}>{children}</View>
          </View>
          <View style={styles.viewBox} />
          <Hexagon
            text={hexagonText}
            onPressHandler={() => {
              indexNumber == 1
                ? openEditEvent()
                : navigation.navigate(screenName)
            }}
          />
        </View>
        {slider && <ImageSlider />}
      </ImageBackground>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    paddingTop: moderateScale(30),
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: '#000000',
    fontSize: scale(11),
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  viewBox: {
    width: '100%',
    height: 0,
    borderLeftWidth: (windowWidth / 100) * 50,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightWidth: (windowWidth / 100) * 49,
    borderRightColor: 'transparent',
    borderTopWidth: 120,
    borderTopColor: MainBlueColor,
  },
})
