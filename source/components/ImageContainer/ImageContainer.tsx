import React, {PropsWithChildren } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import SplashImage from "assets/images/dashboard/da3b8469-7454-4f80-9267-b6863cd2f849.png";
import BlackImg from "assets/images/activities/BlackBGImage.png"
import { reactive } from "common/reactive";
import { Theme } from "components/Theme";
import { useNavigation } from '@react-navigation/native'
import arrow from "assets/images/arrow.png"

interface ModalProps {
  title: string;
  goBack: boolean;
  blackBG:boolean;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
});
export function ImageContainer( {children, title, goBack,blackBG }: PropsWithChildren<ModalProps>
): JSX.Element {
 
    const navigation = useNavigation()
    return (
      <>
    { blackBG ?
       <ImageBackground
      resizeMode="stretch"
      source={BlackImg}
      style={styles.container}
    >
      <ScrollView>
        
        {children}
      </ScrollView>
    </ImageBackground>
      :<ImageBackground
      resizeMode="stretch"
      source={SplashImage}
      style={styles.container}
    >
      <ScrollView>
        <Text style={[Theme.shadowText, {top:39}]}>THE TĒM APP</Text>
        {goBack && (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ marginTop: 70, marginLeft: 40 }}
          >
            <Image source={arrow}/>
          </TouchableOpacity>
        )}
        <Text style={Theme.title}>{title}</Text>
        {children}
      </ScrollView>
    </ImageBackground>
    
      }

      </>
    );

}
