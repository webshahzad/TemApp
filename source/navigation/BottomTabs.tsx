//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import {
  BottomTabsPropsPerPath,
  MainDrawerPropsPerPath,
} from "navigation/params";
import { DashboardStack } from "navigation/DashboardStack";
import { FeedStack } from "navigation/FeedStack";
import { ReportsStack } from "navigation/ReportsStack";
import { SocialStack } from "navigation/SocialStack";
import { ActivityStack } from "navigation/ActivityStack";
import { App } from "models/app/App";

import HomeIcon from "assets/icons/Tabs/home/home.png";
import HomeAcIcon from "assets/icons/Tabs/home-ac/home-ac.png";
import NewspaperIcon from "assets/icons/Tabs/newspaper/newspaper.png";
import NewspaperAcIcon from "assets/icons/Tabs/newspaper-ac/newspaper-ac.png";
import TemsBIcon from "assets/icons/tems-b/tems-b.png";
import TemsBAcIcon from "assets/icons/tems-b-ac/tems-b-ac.png";
import ActivityIcon from "assets/icons/Tabs/activity/act.png";
import ActivityAcIcon from "assets/icons/Tabs/activity-ac/act-ac.png";
import THoneyCombIcon from "assets/icons/Tabs/t-honeycomb/t-honeycomb.png";
import THoneyCombAcIcon from "assets/icons/Tabs/t-honeycomb-ac/t-honeycomb-ac.png";
import { reactive } from "common/reactive";

const Tab = createBottomTabNavigator<BottomTabsPropsPerPath>();

export const BottomTabs: React.FunctionComponent<
  DrawerScreenProps<MainDrawerPropsPerPath, "BottomTabs">
> = (p) => {
  return reactive(() => {
    const unreadCount = App.social.getUnreadMessageCount();
    return (
      <Tab.Navigator
        backBehavior="initialRoute"
        tabBarOptions={{
          showLabel: false,
        }}
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardStack}
          options={{
            tabBarVisible: false,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedStack}
          options={{
            tabBarVisible: false,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Reports"
          component={ReportsStack}
          options={{
            tabBarVisible: false,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Social"
          component={SocialStack}
          options={{
            // tabBarBadge: (unreadCount > 0) ? unreadCount : undefined,
            tabBarVisible: false,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="ActivityTracking"
          component={ActivityStack}
          options={{
            // tabBarBadge: App.activityManager.hasActivityRunning ? '' : undefined,
            tabBarVisible: false,
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    );
  });
};

const styles = StyleSheet.create({
  icon: {
    height: "100%",
    resizeMode: "contain",
  },
  centerIcon: {
    marginTop: "-30%",
  },
});
