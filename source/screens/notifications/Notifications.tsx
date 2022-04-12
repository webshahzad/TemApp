//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useLayoutEffect, useRef } from 'react'
import { FlatList, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { RootStackPropsPerPath } from 'navigation/params'
import { useOnFocus } from 'common/useOnFocus'
import { App } from 'models/app/App'
import { Notification, NotificationType } from 'models/data/Notification'
import { Avatar } from 'components/Avatar'
import dayjs from 'dayjs'
import { reactive } from 'common/reactive'
import { FixedHtml } from 'components/FixedHtml'
import { SwipeRow } from 'react-native-swipe-list-view'
import { Bool } from 'common/constants'
import { showUserDetails } from 'screens/profile/OtherUser'
import { Monitors } from 'models/app/Monitors'
import { HeaderRight } from 'components/HeaderRight'
import { loadAndShowEventDetails } from 'screens/calendar/Events'
import { Header } from 'components/Header'
import HomeBg from "assets/images/HomeBg.png"

export function Notifications(p: StackScreenProps<RootStackPropsPerPath, 'Notifications'>): React.ReactElement {
  useOnFocus(p.navigation, () => {
    App.notifications.reload()
  })

  return reactive(() => {
    return (
      <SafeAreaView style={styles.screen}>
         <ImageBackground source={HomeBg} resizeMode="stretch" style={{ flex: 1 }}>
        <Header rightIcon="ellipsis-h"  icons rightOnPress={()=>App.actionModal.show([
          {
            name: 'Read all',
            onPress: ()=>App.notifications.markAllAsRead()
          },
          {
            name: 'Clear all',
            onPress: () => App.notifications.deleteAll(),
          }
        ]) }/>
        <View style={{marginLeft:20}}>
          <Text style={{color:'#fff',fontSize:12}}>What's New</Text>
        </View>
        <FlatList
        
          data={App.notifications.list}
          keyExtractor={getKey}
          renderItem={({ item, index }) => (
            <NotificationMessage notification={item} index={index} navigation={p.navigation} />
          )}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={App.notifications.list.length === 0 ? styles.emptyListContainer : undefined}
          ListEmptyComponent={EmptyList}
          onRefresh={App.notifications.reload}
          refreshing={Monitors.NotificationsLoading.isActive}
          onEndReached={App.notifications.loadMore}
        />
        </ImageBackground>
      </SafeAreaView>
    )
  })
}

function getKey(item: Notification): string {
  return item._id
}

function NotificationMessage({ notification, index, navigation }: {
  notification: Notification, index: number,
  navigation: StackNavigationProp<RootStackPropsPerPath, 'Notifications'>
}): React.ReactElement {
  const ref = useRef<SwipeRow<unknown> | null>(null)
  return (
    <SwipeRow
      leftOpenValue={120}
      stopLeftSwipe={150}
      rightOpenValue={-75}
      stopRightSwipe={-150}
      disableRightSwipe={notification.is_read === Bool.True}
      ref={ref}
    >
      {NotificationRowControl(notification, index, ref)}
      {NotificationRow(notification)}
    </SwipeRow>
  )
}

function NotificationRow(notification: Notification): React.ReactElement {
  return reactive(() => {
    return (
      <Pressable
        style={[styles.notification, notification.is_read === Bool.True ? styles.read : styles.unread]}
        onPress={getNotificationTapHandler(notification)}
      >
        <Avatar source={notification.userImage} size={35} style={styles.avatar} />

        <View style={styles.notificationDescription}>
          <FixedHtml  html={notification.message}  />
          <Text style={styles.notificationDate}>
            {dayjs(new Date(notification.created_at).getTime()).fromNow()}
          </Text>
        </View>
      </Pressable>
    )
  })
}

function NotificationRowControl(notification: Notification, index: number, swipeRowRef: React.MutableRefObject<SwipeRow<unknown> | null>): React.ReactElement {
  return (
    <View style={styles.rowControl}>
      <Pressable
        style={styles.markAsReadButton}
        onPress={async () => {
          await App.notifications.markAsRead(notification)
          swipeRowRef.current?.closeRow()
        }}
      >
        {/* <Text style={styles.rowControlTextMark}>Mark as read</Text> */}
      </Pressable>
      <Pressable
        style={styles.deleteButton}
        onPress={async () => { await App.notifications.delete(notification, index) }}
      >
        {/* <Text style={styles.rowControlText}>Delete</Text> */}
      </Pressable>
    </View>
  )
}

const emptyHandler = async (): Promise<void> => { }

function getNotificationTapHandler(notification: Notification): (() => void) | undefined {
  let handler: () => Promise<void>
  switch (notification.type) {
    case NotificationType.SentFriendRequest:
    case NotificationType.AcceptFriendRequest:
    case NotificationType.RemindFriendRequest:
      handler = async () => showUserDetails(notification.from)
      break
    case NotificationType.CreatePost:
    case NotificationType.LikePost:
      // not sent from server
      break
    case NotificationType.CommentPost:
      handler = async () => await App.feed.loadAndOpenPostComments(notification.reference_id)
      break
    case NotificationType.CreateGoal:
      handler = async () => await App.goalsAndChallenges.openGoalDetails(notification.reference_id, null)
      break
    case NotificationType.CreateChallenge:
      handler = async () => await App.goalsAndChallenges.openChallengeDetails(notification.reference_id, null)
      break
    case NotificationType.Event:
      handler = async () => await loadAndShowEventDetails(notification.reference_id)
      break
    case NotificationType.NewGroupAdded:
    case NotificationType.Message:
    case NotificationType.ChallengeChat:
    case NotificationType.GoalChat:
      handler = async () => await App.openChat(notification.group_id ?? notification.reference_id)
      break
    default:
      console.warn(`Notification ${NotificationType[notification.type]} can't be handled`)
      handler = emptyHandler
      break
  }
  return async () => {
    await App.notifications.markAsRead(notification)
    await handler()
  }
}

function Separator(): React.ReactElement {
  return (
    <View style={styles.separator} />
  )
}

function EmptyList(): React.ReactElement {
  return (
    <Text style={styles.emptyListLabel}>
      You have no new notifications
    </Text>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  notification: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',    
  },
  read: {
    margin:15,
    // height:55,
    paddingVertical:8,
    borderRadius: 10,
    backgroundColor: "#f7f7f77a",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  unread: {
    // backgroundColor: '#f0f0f0',
    margin:15,
    // height:58,
    paddingVertical:8,
    borderRadius: 12,
    backgroundColor: "#F7F7F7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  avatar: {
    marginRight: 10,
  },
  notificationDescription: {
    flex: 1,
    justifyContent: 'space-between',
  
   },
  notificationDate: {
    alignSelf: 'flex-end',
    color: '#000',
    fontSize: 12,
    marginTop:5,
   
   },

  rowControl: {
    height: '100%',
    flexDirection: 'row',
    margin:20,
    
  },
  markAsReadButton: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
    
  },
  deleteButton: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop:5,
  },
  rowControlText: {
    color: 'red',
  },
  rowControlTextMark: {
    color: '#fff',
  },

  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  separator: {
    // borderTopWidth: 1,
    // borderTopColor: 'lightgrey',
  },
  emptyListLabel: {
    textAlign: 'center',
    color: 'grey',
  },
})
