import React, { PropsWithChildren } from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,

} from "react-native";
import { reactive } from "common/reactive";
import HomeBg from "assets/images/HomeBg.png";
import { useNavigation } from "@react-navigation/native";
import { ImageSlider } from "components/ImageSlider";
import { HeaderRight, HeaderButton } from "components/HeaderRight";
import Hexagon from "components/Hexagon";
import { MainBlueColor, Theme } from "components/Theme";
import { openEditEvent } from "screens/calendar/Events";
import BigBlue from "assets/images/BigBlue.png"

interface ModalProps {
  slider: boolean;
  hexagonText: string;
  screenName: string;
}
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  mainContainer: {
    height: (windowHeight /100)* 100,
    width: "100%",
    // position:"relative"
    
  },
  container: {
    width: (windowWidth /100)* 100,
    height: (windowHeight /100)* 100,
    
  },
  viewBox: {
    width: "100%",
    height: 0,
    borderLeftWidth: (windowWidth / 100) * 50,
    borderStyle: "solid",
    borderLeftColor: "transparent",  
    borderRightWidth: (windowWidth / 100) * 49,
    borderRightColor: "transparent",
    borderTopWidth: 120,
    borderTopColor: MainBlueColor,
  },
  box: {
    height: (windowHeight / 100) * 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: MainBlueColor,
  },
});
export function HomeContainer({
  children,
  slider,
  hexagonText,
  screenName,
  indexNumber,
}: PropsWithChildren<ModalProps>): JSX.Element {
  // return reactive(() => {
  const navigation = useNavigation();
  const windowHeight = Dimensions.get("window").height;
  return (
    <ScrollView
      contentContainerStyle={{ height: windowHeight}}
      nestedScrollEnabled={true}
    >
      <ImageBackground
        source={HomeBg}
        resizeMode="stretch"
        style={styles.mainContainer}
      >
        <View style={styles.container}>
          <View style={{backgroundColor:  MainBlueColor}} />
        <View style={{backgroundColor:  MainBlueColor,paddingTop:15}}>
        <Text style={Theme.shadowText}>THE TĒM APP</Text>
            <HeaderRight buttons={[HeaderButton.globalSearch]} />
        </View>
          <View style={styles.box}>
            
            {children}
          </View>
          <Pressable
            style={styles.viewBox}
            onPress={() =>
              indexNumber == 1
                ? openEditEvent()
                : navigation.navigate(screenName)
            }
          >
            <Hexagon text={hexagonText} />
          </Pressable>
        </View>
          {slider && <ImageSlider />}
      
      </ImageBackground>
    </ScrollView>

  );
  // });
}
