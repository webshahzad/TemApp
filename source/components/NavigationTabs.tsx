//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { reactive } from "common/reactive";
import { View, Text, StyleSheet, Pressable, TextStyle } from "react-native";
import { NavigationManager } from "models/app/NavigationManager";
import { MainBlueColor } from "./Theme";

const FilterBorderRadius = 10;

export interface NavigationTabsStyle {
  container?: TextStyle;
  tab?: TextStyle;
  tabText?: TextStyle;
  active?: TextStyle;
}

export interface NavigationTabsProps<T> {
  manager: NavigationManager<T>;
  style?: NavigationTabsStyle;
}

export function NavigationTabs<T>(
  p: NavigationTabsProps<T>
): React.ReactElement {
  return reactive(() => {
    return (
      <View style={[styles.container, p.style?.container]}>
        {p.manager.tabs.map((tab) => {
          const activeStyle =
            tab.value === p.manager.currentNavigation
              ? styles.active
              : undefined;
          const altActiveStyle = activeStyle ? p.style?.active : undefined;
          return (
            <Pressable
              key={tab.name}
              style={[styles.tab, p.style?.tab, activeStyle, altActiveStyle]}
              onPress={() => p.manager.navigate(tab.value)}
            >
              <Text
                style={[
                  styles.label,
                  p.style?.tabText,
                  activeStyle,
                  altActiveStyle,
                ]}
                numberOfLines={1}
              >
                {tab.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  });
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderRadius: FilterBorderRadius,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    borderRadius: FilterBorderRadius,
    paddingVertical: 5,
    paddingHorizontal: 2,
    margin: 5,
    backgroundColor: "#F7F7F7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.29,
    shadowRadius: 5.65,
    elevation: 7,
  },
  label: {
    color: MainBlueColor,
  },
  active: {
    backgroundColor: MainBlueColor,
    color: "white",
  },
});
