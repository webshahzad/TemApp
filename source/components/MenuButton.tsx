//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Image, Pressable, PressableAndroidRippleConfig, StyleSheet, View } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { DrawerActions, NavigationProp, ParamListBase, NavigationState, EventMapBase } from '@react-navigation/native'
import MenuIcon from 'assets/icons/menu-button/menu-button.png'
import { reactive } from 'common/reactive'
import { App } from 'models/app/App'

export function MenuButton<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string,
  State extends NavigationState = NavigationState,
  ScreenOptions extends {} = {},
  EventMap extends EventMapBase = {}
>(p: StackHeaderLeftButtonProps & { navigation: NavigationProp<ParamList, RouteName, State, ScreenOptions, EventMap> }): JSX.Element {
  return (
    <Pressable
      android_ripple={ripple}
      onPress={() => p.navigation.dispatch(DrawerActions.openDrawer())}
      style={styles.pressable}
    >
      <Image source={MenuIcon} tintColor={p.tintColor} />
      <NotificationsIndicator />
    </Pressable>
  )
}

function NotificationsIndicator(): React.ReactElement | null {
  return reactive(() => {
    if (App.user.stored.unreadNotiCount > 0)
      return (<View style={styles.notificationsIndicator}></View>)
    else
      return null
  })
}

const ripple: PressableAndroidRippleConfig = {
  radius: 22,
  color: '#555',
}

const MenuIconPadding = 20
const Size = 12

const styles = StyleSheet.create({
  pressable: {
    padding: MenuIconPadding,
    justifyContent: 'center',
  },

  notificationsIndicator: {
    position: 'absolute',
    width: Size,
    height: Size,
    borderRadius: 1000,
    backgroundColor: 'crimson',
    borderWidth: 1,
    borderColor: 'white',
    top: MenuIconPadding - Size / 2,
    right: MenuIconPadding - Size / 2,
  },
})
