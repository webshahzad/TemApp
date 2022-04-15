import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import honey from "assets/images/honey-blue-border/honeyborder.png";

interface HexagonProps {
  text: string;
  onPressHandler?: () => void;
}

export default function Hexagon(p: HexagonProps) {
  return (
    <View style={styles.main}>
      <TouchableOpacity activeOpacity={0.6}
       onPress={p.onPressHandler}
        style={{
          width: "80%",
          height: "90%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image source={honey} style={{ width: "100%", height: "100%" }} />
        <Text style={styles.text} numberOfLines={2}>
          {p.text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    position: "absolute",
    bottom: "0%",
    width: "50%",
    height: "30%",
  },
  text: {
    color: "#ffffff",
    position: "absolute",
    width: "75%",
    textAlign: "center",
    textShadowColor: "rgba(255,255,255,6)",
    textShadowOffset: { width: -1, height: -0 },

    textShadowRadius: 5,
    fontWeight: "600",
    fontSize: 13,
  },
});

// export default function Hexagon(p: HexagonProps) {
//   return (
//     <View style={styles.main}>
//      <ImageBackground source={honey} style={{width: 120, height: 125, justifyContent:"center",alignItems:"center"}}>
//      <Text style={styles.text} numberOfLines={2} >{p.text}</Text>
//       </ImageBackground>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//    main: {
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1,
//     position: "absolute",
//     bottom: 90,
//     width: "100%",
//     height: "100%",
//   },
//   text: {
//     color: "#fff",
//     textShadowColor: "rgba(255,255,255,6)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 10,
//     shadowColor: "#fff",
//     flexShrink:1,
//     fontWeight: "600",
//     flexWrap:'wrap',
//     fontSize: 13,
//     width: 100,
//     textAlign: 'center',
//   },

// });
