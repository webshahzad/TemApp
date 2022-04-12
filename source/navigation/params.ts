//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { StackNavigationProp } from '@react-navigation/stack'

import { OtpVerificationProps } from 'screens/auth/OtpVerificationProps'
import { WebPageProps } from 'screens/WebPageProps'
import { EditGoalChallengeProps } from 'screens/gnc/EditGoalChallengeProps'
import { ActivityResultsProps } from 'screens/activity/ActivityResultsProps'
import { OtherUserProps } from 'screens/profile/OtherUser'
import { SearchTematesProps } from 'screens/profile/SearchTemates'
import { VerifyEmailPhoneProps } from 'screens/profile/VerifyEmailPhone'
import { CalendarProps } from 'screens/calendar/Calendar'
import { EditEventProps } from 'screens/calendar/EditEvent'
import { SearchUserLocationProps } from 'screens/profile/SearchUserLocation'
import { EventDetailsProps } from 'screens/calendar/EventDetails'
import { EditActivityProps } from 'screens/reports/EditActivityProps'
// import { ImageContainer } from 'components/ImageContainer/ImageContainer';


export type EmptyProps = undefined | {}

export type RootStackPropsPerPath = {
  WebPage: WebPageProps
  GlobalSearch: EmptyProps
  CategorySearch: EmptyProps
  FindTemmate: EmptyProps
  MoreTemmates: EmptyProps
  ImageContainer: EmptyProps
  LogIn: EmptyProps
  SplashScreen: EmptyProps
  SignUp: EmptyProps
  OtpVerification: OtpVerificationProps
  ForgotPassword: EmptyProps
  ForgotPasswordReset: EmptyProps
  CreateProfile: EmptyProps
  ContentScreen: EmptyProps
  MySchedule: EmptyProps
  ChatList: EmptyProps
  CreateGroup: EmptyProps
  Interests: { isFromSignUp: boolean }
   
  Main: EmptyProps
  Notifications: EmptyProps
  ShareApp: EmptyProps
  ContactUs: EmptyProps
  FAQs: EmptyProps
  About: EmptyProps
  ActivityLog: EmptyProps
  ProfileTemates: EmptyProps

  NewPost: EmptyProps
  ImageSelection: EmptyProps
  Post: PostProps
  SearchTemates: SearchTematesProps
  Comments: EmptyProps
  GoalsAndChallenges: EmptyProps
  EditGoalChallenge: EditGoalChallengeProps
  GoalDetails: EmptyProps
  ChallengeDetails: EmptyProps
  EditActivity: EditActivityProps
  Leaderboard: EmptyProps
  AddTemates: EmptyProps
  ChangePassword: EmptyProps
  DisableAccount: EmptyProps
  SearchGym: EmptyProps
  SearchUserLocation: SearchUserLocationProps
  BlockedUsers: EmptyProps
  Contacts: EmptyProps
  OtherUser: OtherUserProps
  VerifyEmailPhone: VerifyEmailPhoneProps
  Chat: EmptyProps
  GroupInfo: EmptyProps
  EditGroup: EmptyProps
  MyCommunity: EmptyProps

  Calendar: CalendarProps
  ViewCalendar: CalendarProps
  EditEvent: EditEventProps
  EventDetails: EventDetailsProps
}

export interface PostProps {
  post_id: string
  external?: boolean
  onDelete?: () => void
}

export type RootStackNavigation = StackNavigationProp<RootStackPropsPerPath>

export type MainDrawerPropsPerPath = {
  BottomTabs: EmptyProps
}

export type BottomTabsPropsPerPath = {
  Dashboard: EmptyProps
  Feed: EmptyProps
  Reports: EmptyProps
  Social: EmptyProps
  ActivityTracking: EmptyProps
}

export type DashboardStackPropsPerPath = {
  Dashboard: EmptyProps
}

export type FeedStackPropsPerPath = {
  Feed: EmptyProps
  SearchLocation: EmptyProps
  TagPeople: EmptyProps
}

export type ReportsStackPropsPerPath = {
  Reports: EmptyProps
  Hais: EmptyProps
  TotalActivities: EmptyProps
  ActivityResults: ActivityResultsProps
}

export type SocialStackPropsPerPath = {
  ChatList: EmptyProps
  SelectFriend: EmptyProps
  CreateGroup: EmptyProps
  Chat: EmptyProps
}

export type ActivityStackPropsPerPath = {
  ChooseActivity: EmptyProps
  TrackActivity: EmptyProps
  ActivityResults: ActivityResultsProps
}

export type MindfulnessPropsPerPath = {
  Main: EmptyProps
  AssessmentIntro: EmptyProps
  Assessment: EmptyProps
  AssessmentCompleted: EmptyProps
  History: EmptyProps
}
