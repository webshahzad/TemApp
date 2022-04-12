//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { StackScreenProps } from '@react-navigation/stack'
import { App } from 'models/app/App'
import { RootStackPropsPerPath } from 'navigation/params'
import React, { useEffect } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View ,Alert} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
// import GroupImage from 'assets/images/grp-image/grp-image.png'
import Dummy from "assets/images/user-dummy.png"
import { ChatRoom, GroupChatStatus, Visibility } from 'models/data/ChatRoom'
import { InputBadge } from 'components/InputBadge'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import LineAwesomeIcon from 'rn-lineawesomeicons'
import { reactive } from 'common/reactive'
import { UserInfo } from 'models/data/UserInfo'
import { Avatar } from 'components/Avatar'
import { Ref, Transaction } from 'reactronic'
import { Chat } from 'models/app/Social/Chat'
import CircularProgress from "../../../components/CircularProgress"
import Icons from "react-native-vector-icons/MaterialCommunityIcons"
import { ChatHeader } from 'components/Header'


export function GroupInfo(p: StackScreenProps<RootStackPropsPerPath, 'GroupInfo'>): React.ReactElement | null {

  return reactive(() => {
    const chat = App.chat
    if (!chat) return null
    const image = chat.chatInfo.image ? { uri: chat.chatInfo.image } : Dummy
    const showUserActions = shouldShowUserActions(chat)
    setTimeout(() => p.navigation.setOptions({
      // headerRight: showUserActions ? () => (
      //   <Pressable
      //     style={styles.rightHeaderButtons}
      //     onPress={async () => {
      //       await App.social.editGroup.setup()
      //       p.navigation.navigate('EditGroup')
      //     }}
      //   >
      //     <LineAwesomeIcon icon='la-edit' fill='black' height={25} width={25} />         
      //   </Pressable>

      // ) : undefined,
    }))
    const participants = chat.group.info.getParticipants()
        const createGroup = App.social.createGroup;
  
   

    return (
      <SafeAreaView style={styles.screen}>
        <ChatHeader rightIcon='edit' icons rightOnPress={async () => {await App.social.editGroup.setup()
            p.navigation.navigate('EditGroup')
          }} />
        <ScrollView contentContainerStyle={styles.scrollableArea}>
          <View style={styles.card}>
            {/* <Image source={image} style={styles.headerAvatar} /> */}
            <Pressable  >
            <CircularProgress
              trailColor="#000000b5"
              // fill={completion}
              fill={80}
              barWidth={5}
              radius={53}
              strokeColor="#04FCF6"
              styles={false}    
            >
              <View style={[styles.container]}>
               <Pressable onPress={() => createGroup.selectImage()}    >
               <Image source={
                        createGroup.imageUri
                          ? { uri: createGroup.imageUri }
                          : Dummy 
                      } style={styles.headerAvatar} />
               </Pressable>
              </View>

            </CircularProgress>
          </Pressable>
           <View style={styles.maincard}>
           <InfoItem label='Name' text={chat.chatInfo.group_title} />
           </View>
            <View style={styles.maincard}>
            <InfoItem label='Group admin' text={formatAdmin(chat.chatInfo)} />
            </View>
            <View style={styles.maincard}>
            <InfoItem label='Group visibility' text={Visibility.toString(chat.chatInfo.visibility)} />
            </View>
           <View style={styles.maincard}>
           <InfoItem label='Interests' text={formatInterests(chat.chatInfo)} />
           </View>
           <View style={styles.maincard}>
           <InfoItem label='Tēmates' text={chat.chatInfo.members_count?.toString() ?? ''} />
           </View>
            <View style={styles.maincard}>
            <InfoItem label='Description' text={chat.chatInfo.description ?? ''} />
            </View>
          </View>
          {
            participants.length > 0
            &&
            (
              <View style={styles.card}>
                <View style={styles.participantsHeader}>
                  <View style={{backgroundColor: '#fff',width: '100%',borderRadius:8}}>
                  <InputBadge placeholder='Search'   model={Ref.to(chat.group.info).search} style={styles.search} labelBackgroundColor='white' />

                  </View>
                  {showUserActions ? (
                    <Pressable
                      style={styles.addParticipantsButton}
                      onPress={() => {void chat.group.info.openAddTemates()}}>                    
                      <Icons name="plus" style={{fontSize: 14,color: '#0B82DC'}} />
                    </Pressable>
                  ) : null}
                </View>

                {participants.map((x, i) => {
                  
                  return (
                    <Participant
                      key={x.getId()}
                      user={x}
                      chat={chat}
                      topBorder={i !== 0}
                    />
                  )
                })}
              </View>
            )
          }
        </ScrollView>
      </SafeAreaView>
    )
  })
}

function shouldShowUserActions(chat: Chat): boolean {
  return chat.chatInfo.group_chat_status === GroupChatStatus.Active &&
    (chat.chatInfo.editableByMembers || chat.chatInfo.adminData?.user_id === App.user.id)
}

function InfoItem({ label, text }: { label: string, text: string }): React.ReactElement {
  return (
    <View style={[styles.infoItem]}>
      <Text style={styles.infoItemLabel}>{label}</Text>
      <Text style={styles.infoItemText} numberOfLines={1}>{text}</Text>
    </View>
  )
}

function formatAdmin(chat: ChatRoom): string {
  let result = ''
  if (chat.adminData)
    if (chat.adminData.user_id === App.user.id)
      result = 'You '
    else
      result = `${chat.adminData.first_name} ${chat.adminData.last_name} `
  return result
}

function formatInterests(chat: ChatRoom): string {
  if (!chat.interests || chat.interests.length === 0)
    return 'NA'
  return chat.interests.map(x => x.name).join(', ')
}

function Participant({ user, chat, topBorder }: {
  user: UserInfo, chat: Chat,
  topBorder: boolean,
}): React.ReactElement {
  return reactive(() => {
    const showUserActions = shouldShowUserActions(chat)
    
    return (
      <View style={styles.participant}>
      
        <View style={styles.participantInfo}>
        
         <Avatar source={user.profile_pic} size={50} />
          <Text style={styles.participantName}>
            {App.user.id === user.getId() ? 'You' : `${user.first_name} ${user.last_name}`}
          </Text>
         
        </View>
 

        {user.getId() === chat.chatInfo.adminData?.user_id ?
          <Text style={styles.adminLabel}>Admin</Text> :
          showUserActions && user.getId() !== App.user.id ?
            <Pressable style={styles.adminActions} onPress={() =>chat.group.info.showModalForMember(user)}>
              <Icon name='options' color='black' size={25} />
            </Pressable> :
            null
        }
        
      </View>
    )
  })
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  rightHeaderButtons: {
    marginRight: 15,
  },
  scrollableArea: {
    padding: 5,
   
  },

  card: {
    backgroundColor: 'white',
    // elevation: 1,
    // borderRadius: 10,
    // marginBottom: 10,
  },

  headerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 1000,
    alignSelf: 'center',
    marginVertical: 20,
  },

  infoItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  infoItemLabel: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoItemText: {
  },

  participantsHeader: {
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomColor: 'gainsboro',
    margin: 10,
  },
  search: {
    flex: 1,
    marginRight: 15,
   
  },
  addParticipantsButton: {
    position: 'absolute',
    right: 10,
    marginLeft: 15,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
    width: 34,
    height: 34,
    borderRadius:17,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },

  participant: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  participantInfo: {
    flexDirection: 'row',
    // alignItems: 'center',
  
   
  },
  participantName: {
    marginLeft: 10,
  },
  adminLabel: {
    textAlignVertical: 'center',
    fontSize: 12,
    color: 'red',
  },
  adminActions: {
   justifyContent: 'center',
  },

  topBorder: {
    // borderTopColor: 'lightgrey',
    // borderTopWidth: 1,  
  },
  container: {
    width: 91,
    height: 91,
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // bottom: 15,
  },
  maincard: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'gainsboro',
    margin: 10,
    height: 70,
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,

  }
})
