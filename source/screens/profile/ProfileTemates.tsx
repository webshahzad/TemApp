//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { Text, StyleSheet, View, Image, Pressable, InteractionManager } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Transaction } from 'reactronic'

import { EmptyProps, RootStackPropsPerPath } from 'navigation/params'
import { App } from 'models/app/App'
import { NavigationManager } from 'models/app/NavigationManager'
import { NavigationTabs } from 'components/NavigationTabs'
import { Profile } from './Profile'
import { Account } from './Account'
import { Health } from './Health'
import { Temates } from './Temates'
import { useOnFocus } from 'common/useOnFocus'
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer'
import HoneycombFilterIcon from 'assets/icons/t-filter/t-filter.png'
import { GrayColor } from 'components/Theme'
import { SideMenuItem } from 'screens/sidebar/SideMenuItem'
import { DrawerActions } from '@react-navigation/native'
// import { HeaderButton, HeaderRight } from 'components/HeaderRight'

type LocalDrawerPropsPerPath = {
  LocalStack: EmptyProps
}

const Drawer = createDrawerNavigator<LocalDrawerPropsPerPath>()

export function ProfileTematesWithSideMenu(p: StackScreenProps<RootStackPropsPerPath, 'ProfileTemates'>): JSX.Element {
  const userName: string = App.user.getFullName()
  return (
    <Drawer.Navigator
      drawerType='slide'
      drawerPosition='right'
      screenOptions={{ swipeEnabled: false }}
      backBehavior='none'
      drawerContent={() => (
        <View style={styles.sideMenuContent}>
          <View style={styles.sideMenuHeader}>
            <Image source={HoneycombFilterIcon} style={styles.sideMenuImage} />
            <Text style={styles.sideMenuText}>{userName}</Text>
          </View>
          <SideMenuItem
            label='Interests'
            showArrow
            onPress={() => {
              App.rootNavigation.push('Interests', { isFromSignUp: false })
              void InteractionManager.runAfterInteractions(() => p.navigation.dispatch(DrawerActions.closeDrawer()))
            }}
          />
        </View>
      )}
    >
      <Drawer.Screen
        name='LocalStack'
        component={LocalStack}
      />
    </Drawer.Navigator >
  )
}

type LocalStackPropsPerPath = {
  ProfileTemates: EmptyProps
}

const Stack = createStackNavigator<LocalStackPropsPerPath>()

function LocalStack(p: DrawerScreenProps<LocalDrawerPropsPerPath, 'LocalStack'>): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ProfileTemates'
        component={ProfileTemates}
        options={{
          title: '',
          headerTintColor: 'white',
          headerTransparent: true,
          headerLeft: props => (
            <View style={styles.headerLeft}>
              <Pressable
                style={styles.back}
                onPress={() => App.rootNavigation.pop()}
              >
                <Icon name='arrow-left' size={20} color='gray'></Icon>
              </Pressable>
            </View>
          ),
          // headerRight: props => (
          //   <HeaderRight
          //     tintColor={props.tintColor}
          //     buttons={[
          //       HeaderButton.newPost,
          //       HeaderButton.globalSearch,
          //       {
          //         simpleIcon: 'equalizer',
          //         simpleIconStyle: { transform: [{ rotate: '90deg' }] },
          //         onPress: () => {
          //           p.navigation.openDrawer()
          //         },
          //       }
          //     ]}
          //   />
          // ),
        }}
      />
    </Stack.Navigator >
  )
}

enum ProfileTematesNavigation {
  Profile,
  Account,
  Health,
  Temates
}

export const ProfileTemates = (p: StackScreenProps<RootStackPropsPerPath, 'ProfileTemates'>): React.ReactElement => {
  const [manager] = React.useState(() => Transaction.run(
    () => new NavigationManager<ProfileTematesNavigation>(ProfileTematesNavigation.Profile, [{
      value: ProfileTematesNavigation.Profile,
      name: 'Profile',
    }, {
      value: ProfileTematesNavigation.Account,
      name: 'Account',
    }, {
      value: ProfileTematesNavigation.Health,
      name: 'Health',
    }, {
      value: ProfileTematesNavigation.Temates,
      name: 'Tēmates',
    }])))

  return reactive(() => {
    const user = App.user
    const stored = user.stored

    const avatar = user.getAvatar()
    const location = stored.address.getDisplayValue()
    const hasLocation = location.length > 0

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollable}>
        <View style={styles.header}>
          <Image source={avatar} style={styles.headerBackgroundImage} />

          <Image source={avatar} style={styles.avatar} />
          <Text style={[styles.headerText, styles.name]}>{stored.getFullName()}</Text>
          <Text style={styles.headerText}>{stored.username}</Text>
          {hasLocation && (
            <View style={styles.location}>
              <Icon name='map-marker-alt' size={12} color={HeaderColor}></Icon>
              <Text style={[styles.headerText, styles.iconLabel]}>{location}</Text>
            </View>
          )}
        </View>

        <View style={styles.navigation}>
          <NavigationTabs<ProfileTematesNavigation> manager={manager} style={tabStyles}></NavigationTabs>
        </View>

        <View style={styles.tabs}>
          {(manager.currentNavigation === ProfileTematesNavigation.Profile) && <Profile />}
          {(manager.currentNavigation === ProfileTematesNavigation.Account) && <Account />}
          {(manager.currentNavigation === ProfileTematesNavigation.Health) && <Health />}
          {(manager.currentNavigation === ProfileTematesNavigation.Temates) && <Temates />}
        </View>
      </ScrollView>
    )
  })
}

const AvatarSize = 100
const SideMenuImageSize = 70
const BackSize = 30
const TabsBackgroundColor = '#f1fbff'
const HeaderColor = 'white'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollable: {
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'gray',
  },
  headerLeft: {
    marginLeft: 15,
    marginTop: 10,
  },
  headerBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
    width: undefined,
    height: undefined,
  },
  back: {
    width: BackSize,
    height: BackSize,
    borderRadius: BackSize / 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideMenuHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: GrayColor,
    alignItems: 'center',
  },
  sideMenuContent: {
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
  sideMenuImage: {
    height: SideMenuImageSize,
    width: SideMenuImageSize,
  },
  sideMenuText: {
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avatar: {
    width: AvatarSize,
    height: AvatarSize,
    borderWidth: 1,
    borderRadius: AvatarSize / 2,
    borderColor: 'gray',
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
  },
  location: {
    flexDirection: 'row',
    marginTop: 10,
  },
  iconLabel: {
    marginLeft: 5,
  },

  navigation: {
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },

  tabs: {
    flex: 1,
  },
  headerText: {
    color: HeaderColor,
  },
})

const tabStyles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  container: {
    backgroundColor: TabsBackgroundColor,
    borderColor: TabsBackgroundColor,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 20,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  tab: {
    borderRadius: 15,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  tabText: {
    color: 'black',
  },
})
