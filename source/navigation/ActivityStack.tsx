//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'

import { MenuButton } from 'components/MenuButton'
import { BottomTabsPropsPerPath, ActivityStackPropsPerPath } from 'navigation/params'
import { ChooseActivity } from 'screens/activity/ChooseActivity'
import { TrackActivity } from 'screens/activity/TrackActivity'
import { ActivityResults } from 'screens/activity/ActivityResults'
import { TransparentHeaderOptions } from 'components/Theme'
import { App } from 'models/app/App'

const Stack = createStackNavigator<ActivityStackPropsPerPath>()

export function ActivityStack(p: BottomTabScreenProps<BottomTabsPropsPerPath, 'ActivityTracking'>): JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName={App.activityManager.hasActivityRunning ? 'TrackActivity' : 'ChooseActivity'}
            
      screenOptions={{
        title: 'Activity',
        headerShown:false
        // headerLeft: props => 
        // (
        //   <MenuButton {...props} navigation={p.navigation} />
        // ),
      }}
    >
      <Stack.Screen name='ChooseActivity' 	options={{header: () => null}} component={ChooseActivity} />
      <Stack.Screen name='TrackActivity' component={TrackActivity} options={TransparentHeaderOptions} />
      <Stack.Screen name='ActivityResults' component={ActivityResults} options={TransparentHeaderOptions} />
    </Stack.Navigator>
  )
}
