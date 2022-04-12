//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { reactive } from 'common/reactive'
import { App } from 'models/app/App'
import React, { PropsWithChildren, useEffect } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import { ImageSelection as ImageSelectionModel } from '../../models/app/ImageSelection'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { RightHeaderPressableButton } from 'navigation/utils'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackPropsPerPath } from 'navigation/params'
import { Neomorph } from "react-native-neomorph-shadows";
import Rectangle from "../../../assets/Rectangle.png";
import { ChatHeader } from 'components/Header';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { Transaction } from 'reactronic'



export function ImageSelection(p: StackScreenProps<RootStackPropsPerPath, 'EditActivity'>): React.ReactElement {
  const photoSelection = App.imageSelection
  // useEffect(() => {
  //   p.navigation.setOptions({
  //     headerRight: () => RightHeaderPressableButton(p.navigation.goBack),
  //   })
  // })
  return reactive(() => {
    const windowWidth = Dimensions.get("window").width;
    const createGroup = App.social.createGroup;
    const navigation = useNavigation(); 

    useEffect(()=>{
      Transaction.run(()=>{
        App.imageSelection.images= []
      })
  },[navigation.goBack])
    return (
      <>
        <View>
          <ChatHeader rightIcon='cross' rightOnPress={()=>createGroup.resetGroup() } />
        </View>
        <Neomorph
          style={{
            shadowRadius: 1,
            borderRadius: 5,
            // justifyContent:"space-around",
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            elevation: 2,
            backgroundColor: "#F7F7F7",
            width: (windowWidth / 100) * 100,
            height: (windowWidth / 100) * 100,
          }}>
          <View style={styles.outNeo}>
            <Neomorph
              style={{
                marginVertical: 5,
                shadowRadius: 1,
                borderRadius: 5,
                // justifyContent:"space-around",
                shadowColor: "#000",
                shadowOffset: { width: 4, height: 4 },
                elevation: 2,
                backgroundColor: "#F7F7F7",
                width: (windowWidth / 100) * 90,
                height: (windowWidth / 100) * 90,
              }}>
              <Pressable onPress={() => photoSelection.selectImage() } >
              <Image source={ photoSelection?.images?.length> 0
                          ? { uri: photoSelection?.images[0] }
                          :Rectangle} style={styles.selected}  />
              </Pressable>
            </Neomorph>
            
          </View>
        </Neomorph>
        <View style={{ display: 'flex', flexDirection: 'row', }}>
          <View style={styles.Intouch}>
            <View  style={{ display: 'flex',flexDirection:"row",paddingBottom:10 }}>
              <TouchableOpacity style={styles.iconsView}  onPress={photoSelection.selectImage} >
                <SimpleLineIcons name="camera" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconsView} onPress={photoSelection.selectImage}>
                <MaterialCommunity name="checkbox-multiple-blank-outline" />
              </TouchableOpacity>
            </View>
              <View>
              <Pressable onPress={()=>navigation.navigate("Imagefilter")} disabled={photoSelection?.images?.length> 0 ? false: true}>
                <Text style={styles.Next}>Next</Text>
                </Pressable>

                {/* <Pressable onPress={()=>navigation.navigate("Imagefilter")} disabled={photoSelection?.images?.length> 0 ? false: true}></Pressable> */}
              </View>

          </View>
        </View>
        <ScrollView contentContainerStyle={styles.container}>

          <View
            style={[styles.grid, photoSelection.containerWidth === 0 ? styles.hidden : undefined]}
            onLayout={photoSelection.measureGridLayout}
          >
            {photoSelection.images.map((uri, i) => i > 0 &&(
              <Square key={`${uri}-${i}`}>
                <Pressable style={styles.image} onPress={() => photoSelection.removeImage(i)}>
                  <Image source={{ uri }} style={styles.image} />
                </Pressable>
                <Pressable style={styles.deleteImageButton} onPress={() => photoSelection.removeImage(i)}>
                  <Icon name='close-circle-outline' color='red' size={2 * ImageSelectionModel.margin} />
                </Pressable>
              </Square>
            ))}  
            {/* <Pressable style={styles.addButton} onPress={photoSelection.selectImage}>
                <Icon name='plus' color='grey' size={60} />
              </Pressable> */}
          </View>
        </ScrollView>
      </>
    )
  })
}

function Square({ children }: PropsWithChildren<{}>): React.ReactElement {
  return reactive(() => {
    const photoSelection = App.imageSelection
    const size = photoSelection.getSquareSize()
    return (
      <View style={[styles.square, { width: size, height: size }]}>
        {children}
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
  },
  grid: {
    marginLeft: ImageSelectionModel.margin,
    marginTop: ImageSelectionModel.margin,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hidden: {
    opacity: 0,
  },
  square: {
    marginRight: ImageSelectionModel.margin,
    marginBottom: ImageSelectionModel.margin,
    elevation: 1,
    backgroundColor: 'white',
  },
  image: {
    flex: 1,
  },
  deleteImageButton: {
    position: 'absolute',
    top: -ImageSelectionModel.margin,
    right: -ImageSelectionModel.margin,
    height: 2 * ImageSelectionModel.margin,
    width: 2 * ImageSelectionModel.margin,
    borderRadius: 1000,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  addButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderRadius: 5,
    width: "100%",
    height: "100%"
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  iconsView: {
    backgroundColor: '#f7f7f7',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  Next:{
    paddingRight:20,
    color:"#0B82DC"
  },
  outNeo:{
      justifyContent: "space-around",
      marginTop: 10,
      flexDirection: "row"
  },
  Intouch:{
   backgroundColor: '#f7f7f7',
    justifyContent:"space-between",
    width: '100%',
    flexDirection:"row" 
  }
})
