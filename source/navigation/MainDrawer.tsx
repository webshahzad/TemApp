//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from 'react'
import { InteractionManager } from 'react-native'
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentOptions } from '@react-navigation/drawer'
import { StackScreenProps } from '@react-navigation/stack'
import { DrawerActions } from '@react-navigation/native'
import { Reactronic, Transaction } from 'reactronic'
import { reactive } from 'common/reactive'
import { MainDrawerPropsPerPath, RootStackPropsPerPath } from 'navigation/params'
import { BottomTabs } from 'navigation/BottomTabs'
import { SideMenu, SideMenuModel } from 'screens/sidebar/SideMenu'
import { App } from 'models/app/App'

const Drawer = createDrawerNavigator<MainDrawerPropsPerPath>()

export function MainDrawer(s: StackScreenProps<RootStackPropsPerPath, 'Main'>): JSX.Element {
  useEffect(() => {
    // Trick to eliminate drawer blink on first render:
    // https://github.com/react-navigation/react-navigation/issues/7515
    App.finishFirstRenderOfSideMenu()

    // Store root stack navigation to access globally 
    App.rootNavigation.set(s.navigation)
  }, [])

  return reactive(() => {
    return (
      <Drawer.Navigator
        drawerType='front'
        // Trick to eliminate drawer blink on app start
        drawerStyle={App?.firstRenderOfSideMenu ? { width: 0 } : undefined}
        drawerContent={d => <DrawerContent props={d} />}
      >
        <Drawer.Screen name='BottomTabs' component={BottomTabs} />
      </Drawer.Navigator >
    )
  })
}

function DrawerContent({ props }: { props: DrawerContentComponentProps<DrawerContentOptions> }): React.ReactElement {
  const [model] = React.useState(() => Transaction.run(() => {
    function closeDrawer(): void {
      props.navigation.dispatch(DrawerActions.closeDrawer())
    }
    function closeDrawerAfterTransition(): void {
      void InteractionManager.runAfterInteractions(closeDrawer)
    }
    return new SideMenuModel(closeDrawerAfterTransition)
  }))

  React.useLayoutEffect(() => {
    return () => Transaction.run(() => Reactronic.dispose(model))
  }, [])

  return reactive(() => {
    return (
      <SideMenu model={model} />
    )
  })
}
