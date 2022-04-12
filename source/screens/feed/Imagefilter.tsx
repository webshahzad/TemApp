//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { reactive } from "common/reactive";
import { ChatHeader } from "components/Header";
import { Neomorph } from "react-native-neomorph-shadows";
import { useNavigation } from "@react-navigation/native";
import { App } from "models/app/App";
import Rectangle from "../../../assets/Rectangle.png";

export const Imagefilter = () => {
  const photoSelection = App.imageSelection;
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  return reactive(() => {
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView>
          <ChatHeader rightIcon="cross" />
          {/* <View style={styles.card}> */}
          <View style={{ marginTop: 20 }}>
            <Neomorph
              inner // <- enable shadow inside of neomorph
              style={{
                marginTop: 10,
                shadowRadius: 1,
                borderRadius: 5,
                shadowColor: "#fff",
                shadowOffset: { width: 4, height: 4 },
                elevation: 2,
                backgroundColor: "#F7F7F7",
                width: (windowWidth / 100) * 100,
                height: (windowWidth / 100) * 100,
              }}
            >
              <View style={{margin:15}}>
                <Image
                  source={
                    photoSelection?.images?.length > 0
                      ? { uri: photoSelection?.images[0] }
                      : Rectangle
                  }
                  style={styles.selected}
                />
              </View>
            </Neomorph>
            <View
              style={{ justifyContent: "flex-end",marginTop:10 ,alignItems: "flex-end" }}
            >
              <Pressable onPress={() => navigation.navigate("NewPost")}>
                <Text style={styles.Next}>Next</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  });
};

function Button(label: string, onPress: any): React.ReactElement {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
      <Icon name="arrow-right" color="grey" size={20} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  screen: {
    height: "100%",
    width: "100%",
    backgroundColor: "#F7F7F7",
  },

  button: {
    borderTopColor: "lightgray",
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  Next: {
    paddingRight: 20,
    color: "#0B82DC",
  },
  selected: {
    borderRadius: 5,
    width: "100%",
    height: "100%",
  },
});
