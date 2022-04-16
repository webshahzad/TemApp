//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect, useState } from "react";
import {
  StackScreenProps,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyProps, RootStackPropsPerPath } from "navigation/params";

import { reactive } from "common/reactive";
import { doAsync } from "common/doAsync";
import { NavigationTabs } from "components/NavigationTabs";
import { MainBlueColor,GrayColor } from "components/Theme";
import { GoalsAndChallengesList } from "./GoalsAndChallengesList";
import { GoalsAndChallengesSideMenu } from "./GoalsAndChallengesSideMenu";
import { App } from "models/app/App";
import { GoalFilter } from "models/app/GoalsAndChallenges";
import { ChatHeader } from "components/Header";
import CircularProgress from "components/CircularProgress";
import { useNavigation } from "@react-navigation/native";
// import { ScrollView } from 'react-native-gesture-handler'
type LocalDrawerPropsPerPath = {
  LocalStack: EmptyProps;
};

const Drawer = createDrawerNavigator<LocalDrawerPropsPerPath>();

type LocalStackPropsPerPath = {
  Local: EmptyProps;
};

export function GoalsAndChallengesWithSideMenu(
  p: StackScreenProps<RootStackPropsPerPath, "GoalsAndChallenges">
): JSX.Element {
  return (
    <Drawer.Navigator
      drawerType="front"
      drawerPosition="right"
      drawerContent={() => <GoalsAndChallengesSideMenu />}
    >
      <Drawer.Screen
        name="LocalStack"
        component={LocalStack}
        options={{ swipeEnabled: false }}
      />
    </Drawer.Navigator>
  );
}

const Stack = createStackNavigator<LocalStackPropsPerPath>();

function LocalStack(
  p: DrawerScreenProps<LocalDrawerPropsPerPath, "LocalStack">
): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Local"
        component={GoalsAndChallenges}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const GoalsAndChallenges = (
  p: StackScreenProps<LocalStackPropsPerPath, "Local">
): React.ReactElement => {
  const navigation = useNavigation();
  const manager = App.goalsAndChallenges;
  const challenges = manager.getChallengesManger();

  useEffect(() => {
    void manager.currentTabList.loadItems();
  }, []);
 
   const list=manager.gncManager.open
  
  return reactive(() => {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
        <View>
          <ChatHeader rightIcon="cross" isChildren rightOnPress={()=> navigation.navigate("Main")}>
          <View style={styles.filters}>
            <NavigationTabs manager={manager.tabsManager}></NavigationTabs>
          </View>
            </ChatHeader>
             
          <Pressable style={styles.headerButton} onPress={async () => {
              await manager.prepareSideMenu(
                manager.gncManager.upcoming,
                "Future",
                "You do not have any future challenges or goals"
              );
              p.navigation.dispatch(DrawerActions.openDrawer());
            }}   >
            <Text style={styles.headerButtonText}>Upcoming  ({list.pendingCount}) </Text>
            {/* <Icon name='chevron-right' size={12} style={styles.arrow}></Icon> */}
          </Pressable>
          <Pressable style={styles.headerButton} onPress={async () => {
              await manager.prepareSideMenu(
                manager.gncManager.completed,
                "Past",
                "You do not have any past challenges or goals"
              );
              p.navigation.dispatch(DrawerActions.openDrawer());
            }}  >
            <Text style={styles.headerButtonText}>Past</Text>
            {/* <Icon name='chevron-right' size={12} style={styles.arrow}></Icon> */}
          </Pressable>
        </View>

        <View style={styles.listContainer}>
          {manager.tabsManager.currentNavigation === GoalFilter.All && (
            <GoalsAndChallengesList
              list={manager.gncManager.open}
              listEmptyText="You do not have any open challenges or goals"
              header={{
                onPendingPress: () => {
                  doAsync(async () => {
                    await manager.prepareSideMenu(
                      manager.gncManager.upcoming,
                      "Future",
                      "You do not have any future challenges or goals"
                    );
                    p.navigation.dispatch(DrawerActions.openDrawer());
                  });
                },
                onCompletedPress: () => {
                  doAsync(async () => {
                    await manager.prepareSideMenu(
                      manager.gncManager.completed,
                      "Past",
                      "You do not have any past challenges or goals"
                    );
                    p.navigation.dispatch(DrawerActions.openDrawer());
                  });
                },
              }}
            />
          )}

          {manager.tabsManager.currentNavigation === GoalFilter.Goals && (
            <GoalsAndChallengesList 
            
              list={manager.goalsManager.open}
              listEmptyText="You do not have any open goals"
              header={{
                onPendingPress: () => {
                  doAsync(async () => {
                    await manager.prepareSideMenu(
                      manager.goalsManager.upcoming,
                      "Future goals",
                      "You do not have any future goals"
                    );
                    p.navigation.dispatch(DrawerActions.openDrawer());
                  });
                },
                onCompletedPress: () => {
                  doAsync(async () => {
                    await manager.prepareSideMenu(
                      manager.goalsManager.completed,
                      "Past goals",
                      "You do not have any past goals"
                    );
                    p.navigation.dispatch(DrawerActions.openDrawer());
                  });
                },
              }}
            />
          )}

          {manager.tabsManager.currentNavigation === GoalFilter.Challenges && (
            <GoalsAndChallengesList
              list={challenges.open}
              listEmptyText="You do not have any open challenges"
              header={{
                onPendingPress: () => {
                  doAsync(async () => {
                    await manager.prepareSideMenu(
                      challenges.upcoming,
                      "Future challenges",
                      "You do not have any future challenges"
                    );
                    p.navigation.dispatch(DrawerActions.openDrawer());
                  });
                },
                onCompletedPress: () => {
                  doAsync(async () => {
                    await manager.prepareSideMenu(
                      challenges.completed,
                      "Past challenges",
                      "You do not have any past challenges"
                    );
                    p.navigation.dispatch(DrawerActions.openDrawer());
                  });
                },
              }}
            />
          )}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity 
            onPress={() => { 
              App.actionModal.show([
                {
                  name: "Challenge",
                  onPress: () => {
                    App.goalsAndChallenges.createChallenge();
                  },
                },
                {
                  name: "Goal",

                  onPress: () => {
                    App.goalsAndChallenges.createGoal();
                  },
                },
              ]);
            }}
            style={styles.donetext1}
          >
            <Text style={styles.DoneText}>NEW</Text>
            <CircularProgress
              barWidth={5}
              trailColor="#C7D3CA"
              fill={90}
              strokeColor="#0BF9F3"
              radius={27}
              styles={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
                transform: [{ rotate: "-190deg" }],
              }}
            ></CircularProgress>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </SafeAreaView>
    );
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    // height: "100%",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },
  listContainer: {
    // flex: 1,
    width: "100%",
    justifyContent:'center',
    alignItems:'center',
  },
  filters: {
    width: "100%",
    padding: 20,
    paddingBottom: 0,
  },
  footer: {
    // position: 'absolute',
    // bottom: 0,
    paddingVertical: 10,
    alignItems: "center",
  },
  newButton: {
    // paddingVertical: 15,
    // paddingHorizontal: 70,
    // borderRadius: 40,
    // backgroundColor: MainBlueColor,
  },
  donetext1: {
    marginBottom: 10,
    backgroundColor: "#F7F7F7",
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.29,
    shadowRadius: 5.65,
    elevation: 2,
  },
  DoneText: {
    fontSize: 10,
    color: "#0B82DC",
    position: "absolute",
    top: 30,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginLeft: 8,
    borderColor: "#FFFFFF",
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    shadowColor: "#000",
  },
  headerButton: {
    flexDirection: 'row',   
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius:8,
    borderBottomWidth: 1,
    borderColor: GrayColor,
    marginHorizontal:20,
    margin:15,
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
  headerButtonText: {
    flex: 1,
    
  },
});
