//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Platform, Linking, Alert } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links'
import { RootStackPropsPerPath } from 'navigation/params'
import { MainDrawer } from 'navigation/MainDrawer'
import { Notifications } from 'screens/notifications/Notifications'
import { ContactUs } from 'screens/sidebar/ContactUs'
import { FAQs } from 'screens/sidebar/FAQs'
import { About } from 'screens/sidebar/About'
import { Login } from 'screens/auth/Login'
import { SignUp } from 'screens/auth/SignUp'
import { OtpVerification } from 'screens/auth/OtpVerification'
import { ForgotPassword } from 'screens/auth/ForgotPassword'
import { ForgotPasswordReset } from 'screens/auth/ForgotPasswordReset'
import { Comments } from 'screens/feed/Comments'
import { WebPage } from 'screens/WebPage'
import { App, StartScreen } from 'models/app/App'
import { TransparentHeaderOptions } from 'components/Theme'
import { SearchTemates } from 'screens/profile/SearchTemates'
import { GoalsAndChallengesWithSideMenu } from 'screens/gnc/GoalsAndChallenges'
import { EditGoalChallenge } from 'screens/gnc/EditGoalChallenge'
import { ChangePassword } from 'screens/profile/ChangePassword'
import { DisableAccount } from 'screens/profile/DisableAccount'
import { AddTemates } from 'screens/AddTemates'
import { SearchGym } from 'screens/profile/SearchGym'
import { SearchUserLocation } from 'screens/profile/SearchUserLocation'
import { BlockedUsers } from 'screens/profile/BlockedUsers'
import { GoalDetails } from 'screens/gnc/GoalDetails'
import { ActivityLog } from 'screens/reports/ActivityLog/ActivityLog'
import { SelectActivity } from 'screens/reports/ActivityLog/SelectActivity'
import { Reports } from 'screens/reports/Reports'
import { Contacts } from 'screens/profile/Contacts'
import { OtherUser } from 'screens/profile/OtherUser'
import { ChallengeDetails } from 'screens/gnc/ChallengeDetails'
import { ProfileTematesWithSideMenu } from 'screens/profile/ProfileTemates'
import { Interests } from 'screens/profile/Interests'
import { VerifyEmailPhone } from 'screens/profile/VerifyEmailPhone'
import { NewPost } from 'screens/feed/NewPost'
import {Imagefilter} from 'screens/feed/Imagefilter'
import { GlobalSearch } from 'screens/search/GlobalSearch'
import { Chat } from 'screens/social/Chat'
import { CategorySearch } from 'screens/search/CategorySearch'
import { Post } from 'screens/feed/Post'
import { Calendar } from 'screens/calendar/Calendar'
import { EditEvent } from 'screens/calendar/EditEvent'
import { Leaderboard } from 'screens/leaderboard/Leaderboard'
import { EventDetails } from 'screens/calendar/EventDetails'
import { CreateProfile } from 'screens/auth/CreateProfile'
import { EditActivity } from 'screens/reports/EditActivity'
import { ImageSelection } from 'components/ImageSelection/ImageSelection'
import { GroupInfo } from 'screens/social/groups/GroupInfo'
import { EditGroup } from 'screens/social/groups/EditGroup'
import { ImageContainer } from 'components/ImageContainer/ImageContainer'
import SplashScreen from 'screens/SplashScreen'
import { ContentCarousel } from 'screens/Home/ContentCarousel'
import { MoreTemmates } from 'screens/Temmates/MoreTemmates'
import { ChatList } from 'screens/social/ChatList'
import { CreateGroup } from 'screens/social/groups/CreateGroup'
import { Temates } from 'screens/profile/Temates'

const Stack = createStackNavigator<RootStackPropsPerPath>()

export function RootStack(): JSX.Element {

  React.useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link) {
          // app opened from a dynamic link URL
          console.log('********** COLD START DYNAMIC LINK **********')
          console.log(link)
          handleDynamicLink(link)
        } else {
          // use deep link to handle the URL.
          if (Platform.OS === 'android') {
            Linking.getInitialURL()
              .then(url => {
                if (url) {
                  console.log('********** SIMPLE LINK **********')
                  console.log(url)
                }
              })
              .catch(err => console.error(err))
          } else {
            // handle case for iOS
          }
        }
      })
      .catch(err => console.error(err))

    const unsubscribe = dynamicLinks().onLink(link => {
      console.log('********** HOT START DYNAMIC LINK **********')
      handleDynamicLink(link)
    })
    return () => unsubscribe()
  }, [])
  return (
    <Stack.Navigator
      initialRouteName={
        App?.startScreen === StartScreen.Default
          ? (App.user.stored.token ? 'Main' : 'SplashScreen')
          : (App?.startScreen === StartScreen.CreateProfile ? 'CreateProfile' : 'Interests')
      }
    >
      <Stack.Screen name='FindTemmate' component={Temates} options={{headerShown:false,}} />
      <Stack.Screen name='CreateGroup' component={CreateGroup} options={{headerShown:false,}} />
      <Stack.Screen name='ChatList' component={ChatList} options={{headerShown:false,}} />
      <Stack.Screen name='MoreTemmates' component={MoreTemmates} options={{headerShown:false,}} />
      <Stack.Screen name='ContentScreen' component={ContentCarousel} options={{headerShown:false,}} />
      <Stack.Screen name='SplashScreen' component={SplashScreen} options={{headerShown:false,}} />
      <Stack.Screen name='ImageContainer' component={ImageContainer} />
      <Stack.Screen name='Main' component={MainDrawer} options={{ headerShown: false}}/>
      <Stack.Screen name='Notifications' component={Notifications} options={{ title: 'Notifications',headerShown: false }} />
      <Stack.Screen name='LogIn' component={Login} options={TransparentHeaderOptions} />
      <Stack.Screen name='SignUp' component={SignUp} options={TransparentHeaderOptions} />
      <Stack.Screen name='OtpVerification' component={OtpVerification} options={TransparentHeaderOptions} />
      <Stack.Screen name='CreateProfile' component={CreateProfile} options={{ headerShown: false }}  />
      <Stack.Screen name='ForgotPassword' component={ForgotPassword} options={TransparentHeaderOptions} />
      <Stack.Screen name='ForgotPasswordReset' component={ForgotPasswordReset} options={TransparentHeaderOptions} />
      <Stack.Screen name='ContactUs' component={ContactUs} options={TransparentHeaderOptions} />
      <Stack.Screen name='FAQs' component={FAQs} options={{ title: 'FAQs' }} />
      <Stack.Screen name='About' component={About} options={{ title: 'About' }} />
      <Stack.Screen name='Comments' component={Comments} options={{ title: 'Comments', headerShown: false }} />
      <Stack.Screen name='SearchTemates' component={SearchTemates} options={{ title: 'Search' }} />
      <Stack.Screen name='GoalsAndChallenges' component={GoalsAndChallengesWithSideMenu} options={{ headerShown: false }} />
      <Stack.Screen name='GoalDetails' component={GoalDetails} options={{ title: 'Goal', headerShown:false }} />
      <Stack.Screen name='ChallengeDetails' component={ChallengeDetails} options={{ title: 'Challenge', headerShown:false }} />
      <Stack.Screen name='EditGoalChallenge' component={EditGoalChallenge}  options={{headerShown:false,}} />
      <Stack.Screen name='ProfileTemates' component={ProfileTematesWithSideMenu} options={{ headerShown: false }} />
      <Stack.Screen name='Interests' component={Interests} options={{ headerShown: false }} initialParams={{ isFromSignUp: true }} />
      <Stack.Screen name='NewPost' component={NewPost} options={{ title: 'New post', headerShown:false }} />
      <Stack.Screen name='Imagefilter' component={Imagefilter} options={{ title: 'Imagefilter', headerShown:false }} />
      <Stack.Screen name='Post' component={Post} options={{ title: 'Post',headerShown: false }} />
      <Stack.Screen name='AddTemates' component={AddTemates} />
      <Stack.Screen name='ActivityLog' component={ActivityLog} options={{ headerShown:false }} />
      <Stack.Screen name='SelectActivity' component={SelectActivity} />
      <Stack.Screen name='Reports' component={Reports} options={{ headerShown:false }} />
      <Stack.Screen name='WebPage' component={WebPage} />
      <Stack.Screen name='ChangePassword' component={ChangePassword} options={TransparentHeaderOptions} />
      <Stack.Screen name='DisableAccount' component={DisableAccount} options={{ title: 'Disable Account' }} />
      <Stack.Screen name='SearchGym' component={SearchGym} options={{ title: 'Location' }} />
      <Stack.Screen name='SearchUserLocation' component={SearchUserLocation} options={{ title: 'Location' }} />
      <Stack.Screen name='BlockedUsers' component={BlockedUsers} options={{ title: 'Blocked Users' }} />
      <Stack.Screen name='Contacts' component={Contacts} options={{ title: 'Contacts' }} />
      <Stack.Screen name='OtherUser' component={OtherUser} options={{ headerShown: false }} />
      <Stack.Screen name='VerifyEmailPhone' component={VerifyEmailPhone} options={TransparentHeaderOptions} />
      <Stack.Screen name='GlobalSearch' component={GlobalSearch} options={{ title: 'Search' }} />
      <Stack.Screen name='CategorySearch' component={CategorySearch} options={{ title: 'Search' }} />
      <Stack.Screen name='Chat' component={Chat} options={{headerShown:false,}}/>
      <Stack.Screen name='Calendar' component={Calendar} options={TransparentHeaderOptions} />
      <Stack.Screen name='EditEvent' component={EditEvent} options={{ headerShown: false }} />
      <Stack.Screen name='EventDetails' component={EventDetails} options={{ headerShown: false }} />
      <Stack.Screen name='Leaderboard' component={Leaderboard}  options={{ headerShown: false }} />
      <Stack.Screen name='EditActivity' component={EditActivity} options={{ title: 'Edit Activity' }} />
      <Stack.Screen name='ImageSelection' component={ImageSelection} options={{ title: 'Selected Photos',headerShown:false, }} />
      <Stack.Screen name='GroupInfo' component={GroupInfo} options={{headerShown:false,}} />
      <Stack.Screen name='EditGroup' component={EditGroup} options={{ title: 'TĒM info' }} />
    </Stack.Navigator>
  )
}

export function handleDynamicLink(link: FirebaseDynamicLinksTypes.DynamicLink): void {
  const path = getPathFromDynamicLink(link)
  void Linking.openURL('tem://' + path)
  // TODO: Save path if not logged in and open later. Remove when opened.
}

function getPathFromDynamicLink(link: FirebaseDynamicLinksTypes.DynamicLink): string {
  let result: string = ''
  let path: string | undefined
  const parts = link.url.split('?')
  if (parts.length > 1) {
    const queryParts = parts[1].split('&')
    if (!path) {
      path = tryGetValueFor('post_id', queryParts, id => `posts/detail?post_id=${id}&external=true`)
    }
    if (path) {
      result = path
    }
  }
  return result
}

function tryGetValueFor(name: string, queryParts: string[], format?: (value: string) => string): string | undefined {
  let result: string | undefined = undefined
  const prefix = name + '='
  const keyPart = queryParts.find(p => p.startsWith(prefix))
  if (keyPart) {
    const [_, value] = keyPart.split('=')
    if (value) {
      if (format)
        result = format(value)
      else
        result = value
    }
  }
  return result
}
