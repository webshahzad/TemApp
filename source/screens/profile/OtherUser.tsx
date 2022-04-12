//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useLayoutEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { reactive } from "common/reactive";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Reactronic, standalone, Transaction } from "reactronic";

import { RootStackPropsPerPath } from "navigation/params";
import { App } from "models/app/App";
import { FriendshipStatus, UserInfo } from "models/data/UserInfo";
import { doAsync } from "common/doAsync";
import { ReportFlag } from "models/data/UserReport";
import { UserInspector } from "models/app/UserInspector";
import { ActionItem } from "components/ActionModal";
import { createOtherUserTemateSearchOptions } from "models/app/UserSearch";
import { Bool } from "common/constants";
import { Posts } from "./PostList";
import { AcceptOrReject } from "models/app/UserSearchManager";

const RequestStatus = "Send Request";

export interface OtherUserProps {
  model: UserInspector;
}

export const OtherUser = (
  p: StackScreenProps<RootStackPropsPerPath, "OtherUser">
): JSX.Element => {
  useLayoutEffect(() => {
    // unsubscribe all reactions in UserInspector
    return () =>
      Transaction.run(() => {
        Reactronic.dispose(p.route.params.model);
      });
  }, []);
  return reactive(() => {
    const inspector = p.route.params.model;
    const user = inspector.user;
    const manager = App.userSearchManager;

    const location = user.getLocation();
    const hasLocation = location.length > 0;

    let status: string;
    switch (user.friend_status) {
      case FriendshipStatus.RequestSent:
        status = "Request Pending";
        break;
      case FriendshipStatus.RequestReceived:
        status = "Accept";
        break;
      case FriendshipStatus.Connected:
        status = "Connected";
        break;
      default:
        status = RequestStatus;
    }

    const blockUser = (): void => {
      Alert.alert(
        "Block User",
        "Are you sure you want to block this user? After blocking user will not reflect anywhere in the App. You will not able to see user profile.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Block",
            style: "destructive",
            onPress: () => {
              doAsync(async () => {
                await manager.blockUser(user);
                p.navigation.goBack();
              });
            },
          },
        ]
      );
    };

    const sendRequest = (): void => {
      doAsync(async () => {
        await manager.sendRequest(user);
        inspector.updateUserInfo();
      });
    };
    const acceptRequest = (): void => {
      doAsync(async () => {
        await manager.acceptOrRejectFriendRequest(user, AcceptOrReject.Accept);
        inspector.updateUserInfo();
      });
    };
    const deleteTemate = (): void => {
      doAsync(async () => {
        await manager.deleteTemate(user);
        inspector.updateUserInfo();
      });
    };

    const actions: ActionItem[] = [
      {
        name: "Block",
        onPress: blockUser,
        actionType: "danger",
      },
    ];

    if (user.friend_status === FriendshipStatus.Connected) {
      actions.unshift(
        {
          name: "Message",
          onPress: () => {},
        },
        {
          name: "Disconnect",
          onPress: deleteTemate,
        }
      );
    }

    function showActions(): void {
      App.actionModal.show(actions);
    }

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollable}>
          <View style={styles.header}>
            <Image source={user.getAvatar()} style={styles.avatar} />
            <Text style={[styles.headerText, styles.name]}>
              {user.getFullName()}
            </Text>
            <Text style={styles.headerText}>{user.username}</Text>
            {hasLocation && (
              <View style={styles.location}>
                <Icon
                  name="map-marker-alt"
                  size={12}
                  color={HeaderColor}
                ></Icon>
                <Text style={[styles.headerText, styles.iconLabel]}>
                  {location}
                </Text>
              </View>
            )}
            <View style={styles.info}>
              <Pressable
                style={styles.infoSection}
                onPress={() => {
                  if (
                    user.is_private !== Bool.True &&
                    user.number_of_temmates !== undefined &&
                    user.number_of_temmates > 0
                  ) {
                    App.rootNavigation.push("SearchTemates", {
                      options: createOtherUserTemateSearchOptions(user._id),
                    });
                  }
                }}
              >
                <Text style={[styles.headerText, styles.infoValue]}>
                  {user.number_of_temmates}
                </Text>
                <Text style={styles.headerText}>
                  tēmate{user.number_of_temmates === 1 ? "" : "s"}
                </Text>
                <Text> </Text>
              </Pressable>
              <View style={[styles.infoSection, styles.infoCenter]}>
                <View style={styles.score}>
                  <Text style={[styles.headerText, styles.infoValue]}>
                    {user.activityCount?.score}
                  </Text>
                  <Image
                    style={styles.scoreIcon}
                    source={ReportFlag.icon(user.activityCount?.scoreFlag)}
                    width={35}
                    height={20}
                    resizeMethod="scale"
                  />
                </View>
                <Text style={styles.headerText}>Activity score</Text>
                <Text> </Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={[styles.headerText, styles.infoValue]}>
                  {user.goalAndChallengeCount}
                </Text>
                <Text style={styles.headerText}>
                  Goal{user.goalAndChallengeCount === 1 ? "" : "s"} /
                </Text>
                <Text style={styles.headerText}>
                  Challenge{user.goalAndChallengeCount === 1 ? "" : "s"}
                </Text>
              </View>
            </View>
            <View style={styles.buttons}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  if (status === RequestStatus) {
                    sendRequest();
                  } else if (
                    user.friend_status === FriendshipStatus.RequestReceived
                  ) {
                    acceptRequest();
                  }
                }}
              >
                <Text style={styles.headerText}>{status}</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={showActions}>
                <Text style={styles.headerText}>...</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.headerLeft}>
            <Pressable
              style={styles.back}
              onPress={() => p.navigation.goBack()}
            >
              <Icon name="arrow-left" size={20} color="gray"></Icon>
            </Pressable>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Accountability Mission</Text>
            <Text>{user.accountabilityMission}</Text>
          </View>

          <Posts posts={inspector.posts} />
        </ScrollView>
      </SafeAreaView>
    );
  });
};

export function showUserDetails(user: UserInfo | string): void {
  let userId: string;
  if (typeof user === "string") userId = user;
  else userId = user.getId();
  const inspector = standalone(() =>
    Transaction.run(() => new UserInspector(userId))
  );
  App.rootNavigation.push("OtherUser", { model: inspector });
}

const AvatarSize = 100;
const BackSize = 30;
const HeaderColor = "white";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: "100%",
    alignItems: "center",
    backgroundColor: "white",
  },
  scrollable: {
    width: "100%",
  },
  header: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "gray",
  },
  headerLeft: {
    position: "absolute",
    left: 15,
    top: 10,
  },
  back: {
    width: BackSize,
    height: BackSize,
    borderRadius: BackSize / 2,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: AvatarSize,
    height: AvatarSize,
    borderWidth: 1,
    borderRadius: AvatarSize / 2,
    borderColor: "gray",
    marginBottom: 10,
  },
  name: {
    fontWeight: "bold",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  iconLabel: {
    marginLeft: 5,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  infoSection: {
    alignItems: "center",
  },
  infoCenter: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderColor: HeaderColor,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  infoValue: {
    fontWeight: "bold",
  },
  score: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreIcon: {
    marginLeft: 5,
  },
  section: {
    width: "100%",
    padding: 10,
  },
  sectionHeader: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginHorizontal: 5,
    borderColor: HeaderColor,
    borderWidth: 1,
    borderRadius: 5,
  },
  headerText: {
    color: HeaderColor,
  },
});
