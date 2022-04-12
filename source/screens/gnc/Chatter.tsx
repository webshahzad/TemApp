//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Text, View, Image,Keyboard, Pressable ,StyleSheet,Dimensions, SafeAreaView} from 'react-native'

import ChatImage from 'assets/images/chat.png'

import { GoalChallengeDetailsModel } from 'models/data/GoalChallengeDetailsModel'
import { App } from 'models/app/App'
import { doAsync } from 'common/doAsync'
import { reactive } from 'common/reactive'
import { MainBlueColor } from 'components/Theme'
import Dummy from "assets/images/user-dummy.png"
import { Neomorph } from 'react-native-neomorph-shadows'
import { ChatWindowType } from 'models/data/ChatRoom'
import { MessageImage } from 'screens/social/MessageImage'

export interface ChatterProps {
  model: GoalChallengeDetailsModel
}

// TODO: Implement (using Firebase storage...)
export function Chatter(p: ChatterProps): JSX.Element {
  return reactive(() => {
    
   const chat = p?.model.chat
   
   
    const messages = chat?.messages
    const GroupChat =chat?.group
    console.log("GroupChat>>><><",messages)
    
 
    const hasMessages = (messages !== undefined) && (messages.length > 0)
    
    const windowWidth = Dimensions.get("window" ).width;
    return (
      <Pressable
        style={{
          padding: 20,
          // alignItems: 'center',
          // justifyContent: 'center',
          height: 150,
        }}
        onPress={() => doAsync(async () => {
          if (chat) {            
            await App.openChat(chat)
          }
        })}
      >
        {!hasMessages ? (
          <View style={styles.mainView}>
                <View style={{display: 'flex',flexDirection: 'row'}}>
                   <Image source={chat?.chatInfo?.image ? { uri: chat?.chatInfo?.image } : Dummy} style={styles.img} />                    
               <View style={{margin:10}}>
               <Text style={{color: 'gray',marginBottom:8}}>{chat?.chatInfo?.group_title}</Text>
               <Neomorph
                inner // <- enable shadow inside of neomorph
                style={{
                  borderRadius:5,
                  shadowColor: "#fff",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 3.0,
                  elevation: 2,
                  backgroundColor: "#e3e3e3",
                  width: (windowWidth / 100) * 40,
                  height: (windowWidth / 100) * 15,
                  // paddingBottom: 20,                  
                }} >
                 
                  <Text style={{marginTop:10,marginLeft:5,fontSize:12}} numberOfLines={1}>{chat?.chatInfo?.lastMessage}</Text>

                  
              </Neomorph>
               </View>              
                </View>

                <View style={{margin:10,position: 'absolute',right: 0,top:'90%'}}>
              <Neomorph
                inner // <- enable shadow inside of neomorph
                style={{
                  borderRadius:5,
                  shadowColor: "#fff",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 3.0,
                  elevation: 2,
                  backgroundColor: "#f7f7f7",
                  width: (windowWidth / 100) * 30,
                  height: (windowWidth / 100) * 10,
                  // paddingBottom: 20,                  
                }}>
                     <Text style={{marginTop:10,marginLeft:5,fontSize:12}} numberOfLines={2}>{chat?.chatInfo?.lastMessage}</Text>
               
              </Neomorph>
               </View>
          </View>
          // <Text style={{ textAlign: 'center', color: MainBlueColor, fontSize: 16 }}>Click here to view chat messages.</Text>
        ) : (
          <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>This conversation is empty. Click here to start a new conversation.</Text>
        )}
        <View>
        </View>
      </Pressable>
    )
  })
}


export const styles = StyleSheet.create({
  mainView:{
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  img:{
    width: 40,
    height: 40,
    borderRadius: 20,
  },

 
})