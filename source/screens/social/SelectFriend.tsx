//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { PropsWithChildren } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SocialStackPropsPerPath } from 'navigation/params'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useOnFocus } from 'common/useOnFocus'
import { App } from 'models/app/App'
import { InputBadge } from 'components/InputBadge'
import { Avatar } from 'components/Avatar'
import UserDummy from 'assets/images/user-dummy.png'
import { Ref } from 'reactronic'
import { reactive } from 'common/reactive'

export function SelectFriend(p: StackScreenProps<SocialStackPropsPerPath, 'SelectFriend'>): React.ReactElement {
  useOnFocus(p.navigation, () => {
    App.initFriendList()
  })

  return reactive(() => {
    if (!App.friendList)
      return (<NoTematesLabel />)
    return (
      <SafeAreaView style={styles.screen}>
        <InputBadge
          contentStyle={styles.search}
          icon='search'
          placeholder='Search'
          model={Ref.to(App.friendList.options).search}
        />

        {!App.friendList.options.search ? (
          <Card>
            {AvatarWithLabel(UserDummy, 'New Group', () => {
              App.social.createGroup.reset()
              p.navigation.navigate('CreateGroup')
            })}
          </Card>
        ) : null}

        <View style={styles.screenContent}>
          {App.friendList.friends.length > 0 ? (
            <Card>
              <FlatList
                data={App.friendList.friends}
                renderItem={item =>
                  AvatarWithLabel(item.item.profile_pic, item.item.getFullName(), async () => {
                    await App.openChat(item.item)
                  })
                }
                keyExtractor={item => item.user_id}
                onEndReached={App.friendList.loadMore}
              />
            </Card>
          ) : (<NoTematesLabel />)}
        </View>
      </SafeAreaView>
    )
  })
}

function Card({ children }: PropsWithChildren<{}>): React.ReactElement {
  return (
    <View style={styles.card}>
      {children}
    </View>
  )
}

function AvatarWithLabel(avatar: number | string | undefined, label: string, onPress?: () => void): React.ReactElement {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.avatarWithLabel}>
        <Avatar source={avatar} style={styles.avatar} size={60} />
        <Text numberOfLines={1} style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  )
}

function NoTematesLabel(): React.ReactElement {
  return (
    <View style={styles.noTemates}>
      <Text style={styles.noTematesLabel}>
        No tēmates yet
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    padding: 10,
  },
  screenContent: {
    flex: 1,
  },

  search: {
    backgroundColor: 'white',
  },
  card: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
  },

  avatarWithLabel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 20,
  },
  label: {
    flex: 1,
  },

  noTemates: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTematesLabel: {
    alignSelf: 'center',
    color: 'grey',
    fontSize: 20,
  },
})
