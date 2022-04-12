//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { SocialStackPropsPerPath, BottomTabsPropsPerPath } from './params'
import { ChatList } from 'screens/social/ChatList'
import { MenuButton } from 'components/MenuButton'
import { SelectFriend } from 'screens/social/SelectFriend'
import { CreateGroup } from 'screens/social/groups/CreateGroup'

const Stack = createStackNavigator<SocialStackPropsPerPath>()

export function SocialStack(p: BottomTabScreenProps<BottomTabsPropsPerPath, 'Social'>): JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName='ChatList'
    >
      <Stack.Screen
        name='ChatList'
        component={ChatList}
        options={{
          title: 'Tēms',
          headerLeft: props => (
            <MenuButton {...props} navigation={p.navigation} />
          ),
        }}
      />
      <Stack.Screen name='SelectFriend' component={SelectFriend} options={{ title: 'Select friend' }} />
      <Stack.Screen name='CreateGroup' component={CreateGroup} options={{ title: 'TĒM info' }} />
    </Stack.Navigator>
  )
}
