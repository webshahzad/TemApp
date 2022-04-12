//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { PropsWithChildren } from "react";
import {
  GestureResponderEvent,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Chat } from "models/app/Social/Chat";
import { toFixedPadded } from "common/number";
import { reactive } from "common/reactive";
import { App } from "models/app/App";
import { Visibility } from "models/data/ChatRoom";
import CircularProgress from "../../../components/CircularProgress";
import { useNavigation } from "@react-navigation/native";
import { CalendarManager } from "models/app/Calendar/CalendarManager";
import { standalone, Transaction } from "reactronic";
import Dummy from "assets/images/user-dummy.png";
import { Bool } from "common/constants";
import { Switch } from "react-native-gesture-handler";

export function GroupChatDrawer({ chat }: { chat: Chat }): React.ReactElement {
  const navigation = useNavigation();
  return reactive(() => {
    const image = chat.chatInfo.image ? { uri: chat.chatInfo.image } : Dummy;
    return (
      <ScrollView>
        <View style={styles.header}>
          <View>
            <CircularProgress
              trailColor="#000000b5"
              // fill={completion}
              fill={80}
              barWidth={5}
              radius={45}
              strokeColor="#04FCF6"
              styles={false}
            >
              <View style={[styles.container]}>
                <Image source={image} style={styles.headerAvatar} />
              </View>
            </CircularProgress>
          </View>

          <Text style={styles.headerText}>{chat.chatInfo.group_title}</Text>
          <Text style={styles.headerText}>
            {chat.chatInfo.members_count} tēmates |{" "}
            {Visibility.toString(chat.chatInfo.visibility)}
          </Text>
          <Text style={styles.headerText}>
            Average Activity Score |
            {toFixedPadded(chat.chatInfo.avgScore ?? 0, 0, 1)}
          </Text>
        </View>

        <DrawerButton
          onPress={() => {
            App.rootNavigation.push("GroupInfo");
          }}
        >
          <Text style={styles.drawerButtonText}>Info</Text>
        </DrawerButton>

        <DrawerButton
          onPress={() => {
            const manager = standalone(() =>
              Transaction.run(() => new CalendarManager())
            );
            App.rootNavigation.push("Calendar", { manager });
          }}
        >
          <Text style={styles.drawerButtonText}>Calendar</Text>
        </DrawerButton>

        <DrawerButton
          onPress={() => App.openGoalsAndChallenges(chat.chatInfo.group_id)}
        >
          <Text style={styles.drawerButtonText}>GOALS & CHALLENGES</Text>
        </DrawerButton>

        <DrawerButton
          onPress={() => {
            navigation.navigate("Leaderboard");
          }}
        >
          <Text style={styles.drawerButtonText}>LEADERBOARD</Text>
        </DrawerButton>

        <DrawerButton onPress={chat.clearMessages}>
          <Text style={styles.drawerButtonText}>Clear messages</Text>
        </DrawerButton>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <TouchableOpacity
            style={styles.donetext1}
            onPress={() => chat.group.toggleMute}
          >
            <Text style={styles.DoneText}>Mute</Text>
            <CircularProgress
              barWidth={5}
              trailColor="#C7D3CA"
              fill={20}
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

          <View>
            <TouchableOpacity
              style={styles.donetext1}
              onPress={chat.group.askExitGroup}
            >
              <Text style={styles.DoneText}>Exit group</Text>
              <CircularProgress
                barWidth={5}
                trailColor="#C7D3CA"
                fill={20}
                strokeColor="red"
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
        </View>
      </ScrollView>
    );
  });
}

function DrawerButton({
  children,
  onPress,
}: PropsWithChildren<{
  onPress?: (event: GestureResponderEvent) => void;
}>): React.ReactElement {
  return (
    <Pressable style={styles.drawerButton} onPress={onPress}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    alignItems: "center",
  },
  headerBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
    width: undefined,
    height: undefined,
  },
  headerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 1000,
    marginBottom: 10,
  },
  headerText: {
    textAlign: "center",
    fontWeight: "500",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
  },

  drawerButton: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "gainsboro",
    // borderBottomWidth: 1,
    margin: 10,
    height: 50,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  drawerButtonText: {
    textTransform: "uppercase",
    fontWeight: "500",
    color: "#0B82DC",
  },
  exitButtonText: {
    color: "red",
  },
  joinButtonText: {
    color: "green",
  },

  container: {
    width: 91,
    height: 91,
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bottom: 15,
  },
  mainIfo: {
    // backgroundColor: 'red',
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
});
