//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Image, Text, Pressable, StyleSheet, ViewStyle, ImageStyle, TextStyle, ImageSourcePropType, ScrollView, Share } from 'react-native'
import { MenuItemProps, SideMenuItem } from 'screens/sidebar/SideMenuItem'
import { MenuItemBorderWidth } from 'components/Theme'
import { App } from 'models/app/App'
import { reactive } from 'common/reactive'
import { ObservableObject, unobservable, reaction } from 'reactronic'
import { TabActions } from '@react-navigation/native'
import { EmptyIcon } from 'screens/sidebar/SideMenuItem'
import HomeIcon from 'assets/icons/home/home.png'
import NotificationIcon from 'assets/icons/notification/notification.png'
import RedNotificationIcon from 'assets/icons/notification-red/notification-red.png'
import ShareAppIcon from 'assets/icons/share/share.png'
import SettingsIcon from 'assets/icons/settings/settings.png'
import AvatarIcon from 'assets/icons/avatar/avatar.png'
import { Api } from 'models/app/Api'
import LeaderboardImage from 'assets/images/dashboard/leaderboard.png'

export function SideMenu({ model }: { model: SideMenuModel }): JSX.Element {
  return reactive(() => {
    const avatar: ImageSourcePropType = App.user.getAvatar()
    const userName: string = App.user.getFullName()
    return (
      <ScrollView style={{ flex: 1 }}>
        <Pressable
          style={styles.header}
          onPress={async () => {
            await App.openProfileTemates()
            model.closeDrawerAfterTransition()
          }}
        >
          <Image source={avatar} style={styles.userAvatar} />
          <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
        </Pressable>
        {
          model.menuItems.map((item, index) => (
            <SideMenuItem key={item.label + '-' + index} {...item} />
          ))
        }
      </ScrollView>
    )
  })
}

export class SideMenuModel extends ObservableObject {
  menuItems: MenuItemProps[] = []
  @unobservable readonly closeDrawerAfterTransition: () => void

  constructor(closeDrawerAfterTransition: () => void) {
    super()
    this.closeDrawerAfterTransition = closeDrawerAfterTransition
  }

  @reaction
  protected init(): void {
    this.menuItems = [
      {
        icon: HomeIcon,
        label: 'Home',
        onPress: () => {
          App.rootNavigation.dispatch(TabActions.jumpTo('Dashboard'))
          this.closeDrawerAfterTransition()
        },
      },
      {
        icon: App.user.stored.unreadNotiCount > 0 ? RedNotificationIcon : NotificationIcon,
        label: 'Notifications',
        onPress: () => {
          App.rootNavigation.push('Notifications')
          this.closeDrawerAfterTransition()
        },
      },
      {
        icon: AvatarIcon,
        iconColor: 'black',
        label: 'Profile & Account',
        onPress: async () => {
          await App.openProfileTemates()
          this.closeDrawerAfterTransition()
        },
      },
      {
        icon: LeaderboardImage,
        iconColor: 'black',
        label: 'Leaderboard',
        onPress: () => {
          App.rootNavigation.push('Leaderboard')
          this.closeDrawerAfterTransition()
        },
      },
      {
        icon: ShareAppIcon,
        label: 'Share App',
        onPress: async () => {
          const message: string = await App.getShareAppLinkMessage()
          await Share.share({ message })
        },
      },
      {
        icon: SettingsIcon,
        label: 'Settings',
        subItems: [
          {
            icon: EmptyIcon,
            label: 'Contact Us',
            onPress: () => {
              App.rootNavigation.push('ContactUs')
              this.closeDrawerAfterTransition()
            },
          },
          {
            icon: EmptyIcon,
            label: 'FAQs',
            onPress: () => {
              App.rootNavigation.push('FAQs')
              this.closeDrawerAfterTransition()
            },
          },
          {
            icon: EmptyIcon,
            label: 'About',
            onPress: () => {
              App.rootNavigation.push('About')
              this.closeDrawerAfterTransition()
            },
          },
        ],
      },
      {
        label: 'App Version ' + Api.clientVersion,
      },
    ]
  }
}

const HeaderBorderBottomColor = '#77777711'
const UserImageSize = 70

const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
    borderColor: HeaderBorderBottomColor,
    borderBottomWidth: MenuItemBorderWidth,
  } as ViewStyle,
  userAvatar: {
    height: UserImageSize,
    width: UserImageSize,
    borderColor: '#2A92BF',
    borderWidth: 1,
    borderRadius: UserImageSize / 2,
    resizeMode: 'cover',
  } as ImageStyle,
  userName: {
    alignSelf: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
})
