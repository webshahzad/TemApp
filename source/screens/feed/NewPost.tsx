//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useLayoutEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackPropsPerPath } from 'navigation/params'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, ToastAndroid, View, ScrollView,TouchableOpacity, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { App } from 'models/app/App'
import { reactive } from 'common/reactive'
import { Transaction } from 'reactronic'
import { doAsync } from 'common/doAsync'
import { RightHeaderPressableButton } from 'navigation/utils'
import { SelectedImages } from 'components/ImageSelection/SelectedImages'
// import { TabActions } from '@react-navigation/native'
import { ChatHeader } from 'components/Header'
import { Neomorph } from "react-native-neomorph-shadows"
import CircularProgress from "components/CircularProgress"


export const NewPost = (p: StackScreenProps<RootStackPropsPerPath, 'NewPost'>): React.ReactElement | null => {
  // useLayoutEffect(() => {
  //   p.navigation.setOptions({
  //     headerRight: props => RightHeaderPressableButton('Share',
  //       () => doAsync(async () => {
  //         await App.feed.newPost?.submit()
  //         ToastAndroid.show('Post created.', ToastAndroid.SHORT)
  //         p.navigation.goBack()
  //         await App.feed.elements.loadItems()
  //       })),
  //   })
  // }, [])

  const newPost = App.feed.newPost
   const windowWidth = Dimensions.get('window').width
  return reactive(() => {
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView>
          <ChatHeader rightIcon='cross' />
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
              }}>
              <View>
                  <SelectedImages style={styles.selectedImages} />                              
              </View>
            </Neomorph>
          </View>

          <View style={{ marginTop: 10 }}>
            <Neomorph
              inner // <- enable shadow inside of neomorph
              style={{
                // marginTop: 10,
                shadowRadius: 1,
                borderRadius: 15,
                shadowColor: "#000",
                overflow: 'hidden',
                shadowOffset: { width: 4, height: 4 },
                elevation: 2,
                backgroundColor: "#F7F7F7",
                width: (windowWidth / 100) * 90,
                height: (windowWidth / 100) * 25,
                margin: 20
              }}>
              <View style={styles.description}>
                <TextInput
                  style={styles.caption}
                  multiline
                  placeholder='Caption'
                  onChangeText={value => {
                    Transaction.run(() => {
                      newPost.caption = value
                    })
                  }}
                />
              </View>
            </Neomorph>
          </View>
          {/* <View style={styles.mainbutton}>
            <TouchableOpacity onPress={()=> p.navigation.push('TagPeople')} 
            style={styles.tagpeople}>
              <Text style={styles.text}>Tag People</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> p.navigation.push('SearchLocation')}  
              style={styles.addlocation}>
              <Text style={styles.text}>Add Location</Text>
            </TouchableOpacity>
          </View> */}

          <View style={{flexDirection:"row",justifyContent:'space-around'}}>
          <TouchableOpacity onPress={()=> p.navigation.push('TagPeople')} 
            style={styles.tagpeople}>
              <Text style={styles.text}>Tag People</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> p.navigation.push('SearchLocation')}  
              style={styles.addlocation}>
              <Text style={styles.text}>Add Location</Text>
            </TouchableOpacity>
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={()=> doAsync(async () => {
          await App.feed.newPost?.submit()
          ToastAndroid.show('Post created.', ToastAndroid.SHORT)
          p.navigation.navigate("Feed")
          await App.feed.elements.loadItems()
        })}             
            style={styles.donetext1}>
              <Text style={styles.DoneText}>SHARE</Text>
              <CircularProgress
                barWidth={5}
                trailColor="#C7D3CA"
                fill={40}
                strokeColor="#0BF9F3"
                radius={27}
                styles={{
                  justifyContent: "center", alignItems: "center", marginBottom: 8,
                  transform: [{ rotate: '-190deg' }],
                }}
              ></CircularProgress>
            </TouchableOpacity>
          </View>
           {/* {Button('Tag people', () => {
              App.tagPeople.selectImage(photo)
              p.navigation.push('TagPeople')
            })} */}
            {/* {Button('Add location', () => {
              p.navigation.push('SearchLocation')
            })}  */}
          {/* </View> */}
        </ScrollView>
      </SafeAreaView>
    )
  })
}

function Button(label: string, onPress: any): React.ReactElement {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
      <Icon name='arrow-right' color='grey' size={20} />
    </Pressable>
  )
}
const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
    backgroundColor: '#F7F7F7',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
  },

  description: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  selectedImages: {
    width: "99%",
    height: "99%",   
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',    
    paddingHorizontal:20,
    paddingVertical:20, 
     // marginRight: 10,
    // marginLeft:5,  
    // padding: 5, 
  },
  caption: {
    flex: 1,
    textAlignVertical: 'top',
    height: 100,
    padding: 0,
    overflow: 'hidden',
    paddingBottom: 25,
  },

  button: {
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  mainbutton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:"space-between",
},

tagpeople: {
    backgroundColor: '#F7F7F7',
    marginHorizontal: 50,
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 2,
},
addlocation: {
    backgroundColor: '#F7F7F7',
    marginHorizontal: 50,
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 2,
},
text: {
    color: '#0B82DC',
    fontSize: 12,
    fontWeight: '500',
},
donetext1: {
  marginBottom: 10,
  backgroundColor: "#F7F7F7",
  width: 70,
  height: 70,
  borderRadius: 35, 
  shadowColor: "#000",
  shadowOffset: {
      width: 0,
      height: 10,
  },
  shadowOpacity: 0.29,
  shadowRadius: 5.65,
  elevation: 2,             
},
DoneText: {
  fontSize: 10,
  color: "#0B82DC",
  position: "absolute",
  top: 30,
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  width: "80%",
  marginLeft: 8,
  borderColor: "#FFFFFF",
  fontWeight: "500",
  textShadowColor: "rgba(0,0,0,0.5)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 3,
  shadowColor: "#000",
},
})
