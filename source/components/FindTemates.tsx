import { useNavigation } from "@react-navigation/native";
import { reactive } from "common/reactive";
import CircularProgress from "components/CircularProgress";
import { App } from "models/app/App";
import React from "react";
import {StyleSheet, Text, TouchableOpacity,} from "react-native";

export function FindTemates(): JSX.Element {
  const navigation = useNavigation();
  return reactive(() => {


    return (
      <>
        <TouchableOpacity
          style={styles.Find}
          onPress={()=> navigation.navigate("FindTemmate")}
        >
          <Text style={styles.TematesText}>Find Temates</Text>
          <CircularProgress
            barWidth={1}
            trailColor="#C7D3CA"
            fill={100}
            strokeColor="#04FCF6"
            radius={22}
            styles={{ justifyContent: "center", alignItems: "center" }}
          ></CircularProgress>
        </TouchableOpacity>
      </>
    );
  });
}
const styles = StyleSheet.create({
  Find: {
    backgroundColor: "#3d3d3d",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignSelf: "flex-end",
    marginRight: 50,
    position: "absolute",
    bottom: 15,
    left: 20,
    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 18,
  },
  TematesText: {
    fontSize: 7,
    color: "#fff",
    position: "absolute",
    textAlign: "center",
    marginHorizontal: 11,  
    width: "60%",
    borderColor: "#FFFFFF",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: "#ffff",
   
  },
});
