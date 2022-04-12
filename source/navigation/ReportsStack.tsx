//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'

import { ReportsStackPropsPerPath, BottomTabsPropsPerPath } from './params'
import { Reports } from 'screens/reports/Reports'
import { MenuButton } from 'components/MenuButton'
import { Hais } from 'screens/reports/Hais'
import { TotalActivitiesWithSideMenu } from 'screens/reports/TotalActivities'

const Stack = createStackNavigator<ReportsStackPropsPerPath>()

export function ReportsStack(p: BottomTabScreenProps<BottomTabsPropsPerPath, 'Reports'>): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Reports'
        component={Reports}
        options={{
          title: 'Reports',
          headerLeft: props => (
            <MenuButton {...props} navigation={p.navigation} />
          ),
        }}
      />
      <Stack.Screen name='Hais' component={Hais} options={{ title: 'HAIS' }} />
      <Stack.Screen name='TotalActivities' component={TotalActivitiesWithSideMenu} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}
