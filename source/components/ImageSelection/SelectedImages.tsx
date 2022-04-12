//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { reactive } from "common/reactive";
import SwiperComp from "components/Swiper";
import { MainBlueColor } from "components/Theme";
import { App } from "models/app/App";
import React from "react";
import Swiper from "react-native-swiper";

import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";



export function SelectedImages({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}): React.ReactElement {
  return reactive(() => {
    const imageSelection = App.imageSelection;
    const firstImage = imageSelection.images[0];
    const secondImage = imageSelection.images[1];

    return (
      <>

        <Pressable
          style={[
            styles.container,
            style,
            secondImage ? styles.containerPadding : undefined,
          ]}
        // onPress={() => {
        //   App.rootNavigation.push("ImageSelection");
        // }}
        >
          <Swiper showsPagination={false}>
            {secondImage ? (
              <Image style={styles.backgroundImage} source={{ uri: secondImage }} />
            ) : null}
            <Image style={styles.foregroundImage} source={{ uri: firstImage }} />
          </Swiper>
          {/* {secondImage ? (
            <TouchableOpacity onPress={() => {
              App.rootNavigation.push("ImageSelection");
            }}
              style={styles.imagesCount}>
              <Text style={styles.imageCountText}>
                {imageSelection.images.length}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addImages}>
              <Icon name="plus" color="red" size={20} onPress={() => {
                App.rootNavigation.push("ImageSelection");
              }} />
            </View>
          )} */}
        </Pressable>


      </>
    );
  });
}


const styles = StyleSheet.create({
  container: {},
  containerPadding: {
    // paddingBottom: "5%",
    // paddingRight: "5%",
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  foregroundImage: {
    flex: 1,
    borderRadius: 10,
    width: "99%",
    height: "99%",
    justifyContent: 'center',
    alignItems: 'center',

  },
  backgroundImage: {
    
    // position: "absolute",
    // bottom: 20,
    // right: -45,
    flex: 1,
    width: "99%",
    height: "99%",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagesCount: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 25,
    height: 25,
    borderRadius: 1000,
    overflow: "hidden",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: MainBlueColor,
  },
  imageCountText: {
    color: MainBlueColor,
  },
  addImages: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 25,
    height: 25,
    borderRadius: 1000,
    overflow: "hidden",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
  },
});
