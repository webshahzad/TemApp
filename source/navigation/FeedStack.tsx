//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { FeedStackPropsPerPath, BottomTabsPropsPerPath } from "./params";
import { Feed } from "screens/feed/Feed";
import { MenuButton } from "components/MenuButton";
import { SearchLocation } from "screens/feed/SearchLocation";
import { TagPeople } from "screens/feed/TagPeople";

const Stack = createStackNavigator<FeedStackPropsPerPath>();

export const FeedStack: React.FunctionComponent<
  BottomTabScreenProps<BottomTabsPropsPerPath, "Feed">
> = (p) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{
          // title: "TĒM",
          headerShown: false,
          // headerLeft: (props) => (
          //   <MenuButton {...props} navigation={p.navigation} />
          // ),
        }}
      />
      <Stack.Screen
        name="SearchLocation"
        component={SearchLocation}
        options={{
          // title: "Location",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TagPeople"
        component={TagPeople}
        options={{
          // title: "Tag People",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
