//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  PressableAndroidRippleConfig,
  Dimensions,
} from "react-native";
import SplashImage from "assets/images/dashboard/da3b8469-7454-4f80-9267-b6863cd2f849.png";

const SplashTextWidth = "35%";
const SectionWidthPercent: number = 77;

export const CommentColor = "#77777722";
export const MainBlueColor = "#018be4";
export const MainColor = "#0682DC";
export const LightBlueColor = "#00a8ea";
export const DangerColor = "#ff0000";
export const HexPatternStrokeColor = "#d8d8d8";

export const BlueBackground = "#8AC8F2";
export const GrayColor = "#EAE7EA";
export const DefaultGrayColor = "#F2F2F2";

export const MenuItemBorderColor = "#77777733";
export const MenuItemBorderWidth = 1;

export const DefaultPressableRipple: PressableAndroidRippleConfig = {
  color: HexPatternStrokeColor,
};

export const TransparentHeaderOptions = {
  title: "",
  headerTransparent: true,
  headerShown: false,
};
export const Theme = StyleSheet.create({
  screen: {
    height: "100%",
    alignItems: "stretch",
  } as ViewStyle,

  splashImage: {
    flex: 1,
    width: null as any,
    height: "100%",
    aspectRatio: 2,
  } as ImageStyle,

  title: {
    position: "absolute",
    top: 130,
    color: "#FFFFFF",

    lineHeight: 25,
    left: `${(100 - SectionWidthPercent) / 2}%`, // to match section position
    width: SplashTextWidth,
    fontSize: 18,
    fontWeight: "500",
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
  } as TextStyle,
  CalendarText: {
    position: "absolute",
    top: 130,
    color: "#FFFFFF",

    lineHeight: 25,
    left: `${(100 - SectionWidthPercent) / 2}%`, // to match section position
    width: SplashTextWidth,
    fontSize: 18,
    fontWeight: "500",
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
  } as TextStyle,
  buttonText: {
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    shadowColor: "#fff",
  } as TextStyle,


  buttonTexts: {
    textAlign:"center",
    fontWeight:"500",
    fontSize:14,
    color:"#0B82DC",
    
  } as TextStyle,

  shadowText: {
    textAlign: "center",
    color: "#FFF",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
    width: "100%",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  } as TextStyle,

  rightText: {
    textAlign: "right",
    width: "100%",
    height: "100%",
    fontSize: 16,
    marginLeft: 15,
    fontWeight: "bold",
    textTransform: "uppercase",
    position: "absolute",
    left: "81%",
    top: "15%",
    transform: [{ rotate: "-90deg" }],
    color: "#0A64AA",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#fff",
  } as TextStyle,
  splashHeading: {
    top: 75,
    textAlign: "center",
    left: 23,
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#064574",
    width: "100%",
    fontSize: 22,
    fontWeight: "600",
    textTransform: "uppercase",
  } as TextStyle,

  splash: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginBottom: "5%",
    backgroundColor: "red",
  } as ViewStyle,

  otpText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 10,
    textTransform: "uppercase",
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    borderColor: "#0B82DC",
    borderWidth: 0.5,
    paddingBottom: 10,
    marginTop: 30,
    right: 20,
    shadowColor: "#000000",
  } as ViewStyle,

  section: {
  // marginTop:-25

  } as ViewStyle,
  social: {
    display: "flex",
    flexDirection: "column",
    marginTop: 170,
   
  } as ViewStyle,
  heading: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Avenir Next",
    fontWeight: "500",
    width: 261,
    height: 25,
    paddingLeft: 40,
  } as ViewStyle,

  line: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
  } as ViewStyle,
  otpBox: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    marginRight: "10%",
  } as ViewStyle,
  text: {
    color: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 0,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#064574",
    letterSpacing: 1,
    fontSize: 10,
    textTransform: "uppercase",
  } as ViewStyle,

  link: {
    color: "#000000",
    borderBottomWidth: 1.5,
    fontWeight: "500",
    fontSize: 10,
    textDecorationStyle: "solid",
    textTransform: "uppercase",
    textDecorationColor: "blue",
  } as TextStyle,
  validationWrapper: {
    width: "100%",
    marginTop: -20,
  } as TextStyle,
}); 

export const SwitchColors = {
  ThumbOff: "#ECECEC",
  DangerousThumbOn: "#F50057",
  DefaultThumbOn: "#008275",

  DangerousTrack: {
    false: "#B2B2B2",
    true: "#FA7FAB",
  },
};
