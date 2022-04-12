//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { DashboardStackPropsPerPath, BottomTabsPropsPerPath } from './params'
import { Dashboard } from 'screens/Dashboard'
import { MenuButton } from 'components/MenuButton'
import { App } from 'models/app/App'

const Stack = createStackNavigator<DashboardStackPropsPerPath>()

export function DashboardStack(p: BottomTabScreenProps<BottomTabsPropsPerPath, 'Dashboard'>): JSX.Element {
  useEffect(() => {
    App.saveTabsNavigation(p.navigation)
    return App.resetTabsNavigation
  })

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Dashboard'
        component={Dashboard}
        options={{headerShown:false}}
        // options={{
        //   title: 'TĒM',
        //   headerLeft: props => (
        //     <MenuButton {...props} navigation={p.navigation} />
        //   ),
        // }}
      />
    </Stack.Navigator>
  )
}
