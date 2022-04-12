import React from "react";
import { ImageBackground, Text } from "react-native";
import Splash from "assets/images/Splash.png";
import { Theme } from "components/Theme";

const SplashScreen = ({ navigation }) => {
  setTimeout(() => {
    navigation.replace("LogIn");
  }, 3000);

  return (
    <ImageBackground resizeMode="stretch" source={Splash} style={{ flex: 1 }}>
      <Text style={Theme.splashHeading}>THE TĒM APP</Text>
    </ImageBackground>
  );
};

export default SplashScreen;
