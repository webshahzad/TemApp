//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ref } from "reactronic";
import Icon from "react-native-vector-icons/FontAwesome5";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackPropsPerPath } from "navigation/params";
import { reactive } from "common/reactive";
import { InputBadge } from "components/InputBadge";
import { InputBadgeDark } from "components/InputBadgeDark";
import { App } from "models/app/App";
import { Avatar } from "components/Avatar";
import { UserInfo } from "models/data/UserInfo";
import { MainBlueColor } from "components/Theme";
import { ChatRoom } from "models/data/ChatRoom";
import CircularProgress from "components/CircularProgress";
import arrow from "assets/images/arrow.png";
import { useNavigation } from "@react-navigation/native";

export const AddTemates = (
  p: StackScreenProps<RootStackPropsPerPath, "AddTemates">
): React.ReactElement => {
  const manager = App.addTemates;
  const navigation = useNavigation();
  useEffect(() => {
    p.navigation.setOptions({
      // headerLeft:false,
      title: "",
      headerStyle: { backgroundColor: "#3E3E3E" },
      headerLeft: (props) => (
        <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={{ width: "150%" }}
          >
            <Image style={{ marginLeft: 10 }} source={arrow} />
          </Pressable>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Text style={styles.temText}>THE TĒM APP</Text>
          </View>
        </View>
      ),
      headerRight: (props) => (
        <View style={styles.rightHeaderButtons}>
          <Pressable
            onPress={async () => {
              await App.addTemates.apply();
              App.rootNavigation.pop();
            }}
          >
            {/* <Text style={styles.rightHeaderButtonLabel}>Done</Text> */}
            <View style={styles.donetext1}>
              <Text style={styles.DoneText}>Done</Text>
              <CircularProgress
                barWidth={1}
                trailColor="#C7D3CA"
                fill={70}
                strokeColor="#B620E0"
                radius={15}
                styles={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              ></CircularProgress>
            </View>
          </Pressable>
        </View>
      ),
    });
    manager.resetFilter();
  }, []);

  return reactive(() => {
    const tematesToAdd = manager.tematesToAdd;
    const disabledTemates = manager.disabledTematesRef?.value;
    const temates = manager.temates;
    const tems = manager.tems;
    const publicTems = manager.publicTems;
    const selectedTem = manager.selectedTem;

    const showTems = manager.showTems && tems.items.length > 0;
    const showPublicTems =
      manager.showTems && manager.showPublicTems && publicTems.items.length > 0;
    const showTemates = manager.showUsers && temates.items.length > 0;
    const hasContent = showTems || showPublicTems || showTemates;


    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView
          style={styles.scrollableScreen}
          contentContainerStyle={{ minHeight: "100%" }}
        >
          <View>
            <Text style={{ fontSize: 18, color: "#0B82DC", marginLeft: 15 }}>
              ADD TĒMATES
            </Text>
          </View>
          <InputBadgeDark
            placeholder="Search"
            // icon='search'

            model={Ref.to(manager).filter}
            style={styles.search}
            contentStyle={styles.searchContent}
          />

          {tematesToAdd.length > 0 || selectedTem !== undefined ? (
            <ScrollView style={styles.selectedUsers} horizontal>
              {selectedTem !== undefined && (
                <View style={styles.userBadge}>
                  <Pressable
                    style={styles.unselectUserButton}
                    onPress={() => manager.toggleSelectedTem(selectedTem)}
                  >
                    <Icon name="times-circle" solid color="red" size={20} />
                  </Pressable>
                  <Avatar source={selectedTem.image} size={UserBadgeSize} />
                  <Text
                    style={styles.userBadgeName}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {selectedTem.group_title}
                  </Text>
                </View>
              )}
              {tematesToAdd.map((user) => (
                <View key={user._id} style={styles.userBadge}>
                  <Pressable
                    style={styles.unselectUserButton}
                    onPress={() => manager.toggleUserToBeAdded(user)}
                  >
                    <Icon name="times-circle" solid color="red" size={20} />
                  </Pressable>
                  <Avatar source={user.profile_pic} size={UserBadgeSize} />
                  <Text
                    style={styles.userBadgeName}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {user.getFullName()}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : null}

          {showTems && (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderLabel}>tēms</Text>
              </View>

              {tems.items.map((tem) => {
                const isTemSelected = selectedTem?.group_id === tem.group_id;
                return (
                  <Pressable
                    key={tem.group_id}
                    onPress={() => manager.toggleSelectedTem(tem)}
                  >
                    {TemRow(tem, isTemSelected)}
                  </Pressable>
                );
              })}
              {tems.hasMoreItems() && (
                <Pressable
                  style={styles.showMore}
                  onPress={() => tems.loadMoreItems({ search: manager.filter })}
                >
                  <Text style={styles.showMoreText}>Show More</Text>
                </Pressable>
              )}
            </View>
          )}

          {showPublicTems && (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderLabel}>public tēms</Text>
              </View>

              {publicTems.items.map((tem) => {
                const isTemSelected = selectedTem?.group_id === tem.group_id;
                return (
                  <Pressable
                    key={tem.group_id}
                    onPress={() => manager.toggleSelectedTem(tem)}
                  >
                    {TemRow(tem, isTemSelected)}
                  </Pressable>
                );
              })}
              {publicTems.hasMoreItems() && (
                <Pressable
                  style={styles.showMore}
                  onPress={() =>
                    publicTems.loadMoreItems({ search: manager.filter })
                  }
                >
                  <Text style={styles.showMoreText}>Show More</Text>
                </Pressable>
              )}
            </View>
          )}

          {showTemates && (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderLabel}>TĒMATES</Text>
              </View>

              {temates.items.map((user) => {
                const userId = user.getId();
                const disabled = !!(
                  disabledTemates &&
                  disabledTemates.findIndex((x) => x.getId() === userId) >= 0
                );
                const isUserSelected =
                  tematesToAdd.findIndex((x) => x.getId() === userId) >= 0;
                if (disabled) return TemateRow(user, disabled, isUserSelected);
                else
                  return (
                    <Pressable
                      key={user._id}
                      onPress={() => manager.toggleUserToBeAdded(user)}
                    >
                      {TemateRow(user, disabled, isUserSelected)}
                    </Pressable>
                  );
              })}
              {temates.hasMoreItems() && (
                <Pressable
                  style={styles.showMore}
                  onPress={() =>
                    temates.loadMoreItems({ search: manager.filter })
                  }
                >
                  <Text style={styles.showMoreText}>Show More</Text>
                </Pressable>
              )}
            </View>
          )}

          {!hasContent && (
            <View style={styles.noItems}>
              <Text style={styles.noItemsText}>No tēmates yet</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  });
};

function TemateRow(
  user: UserInfo,
  disabled: boolean,
  isUserSelected: boolean
): React.ReactElement {
  return (
    <View key={user._id} style={styles.row}>
      <Avatar source={user.profile_pic} size={60} style={styles.rowAvatar} />
      <Text
        numberOfLines={1}
        style={[{ flex: 1 }, disabled ? styles.alreadyAdded : undefined]}
      >
        {user.first_name} {user.last_name}
      </Text>
      {isUserSelected || disabled ? (
        // <Icon name='check' color={MainBlueColor} size={20} />
        <View style={styles.hexagon}>
          <View style={styles.hexagonInner}>
            <Text
              style={{
                fontSize: 9,
                color: "black",
                fontWeight: "bold",
                textShadowColor: "rgba(0,0,0,0.5)",
                textShadowOffset: { width: -1, height: -1 },
                textShadowRadius: 5,
                shadowColor: "#fff",
              }}
            >
              ADDED
            </Text>
          </View>
          <View style={styles.hexagonBefore} />
          <View style={styles.hexagonAfter} />
        </View>
      ) : (
        <View style={styles.hexagon1}>
          <View style={styles.hexagonInner1}>
            <Text
              style={{
                fontSize: 9,
                color: "#fff",
                fontWeight: "bold",
                textShadowColor: "rgba(0,0,0,0.5)",
                textShadowOffset: { width: -1, height: -1 },
                textShadowRadius: 5,
                shadowColor: "#fff",
              }}
            >
              + ADD
            </Text>
          </View>
          <View style={styles.hexagonBefore1} />
          <View style={styles.hexagonAfter1} />
        </View>
      )}
    </View>
  );
}

function TemRow(tem: ChatRoom, isSelected: boolean): React.ReactElement {
  const membersCount: number = tem.members_count ?? 0;
  return (
    <View key={tem.group_id} style={styles.row}>
      <View style={styles.userInfo}>
        <Avatar source={tem.image} size={60} style={styles.rowAvatar} />
        <View>
          <Text>{tem.group_title}</Text>
          {membersCount > 0 && (
            <Text style={styles.membersCount}>
              {membersCount} member{membersCount > 1 ? "s" : ""}
            </Text>
          )}
        </View>
      </View>

      {isSelected ? (
        <Icon name="check" color={MainBlueColor} size={30} />
      ) : null}
    </View>
  );
}

const UserBadgeSize = 60;

const styles = StyleSheet.create({
  rightHeaderButtons: {
    marginRight: 15,
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  rightHeaderButtonLabel: {
    fontSize: 16,
  },
  screen: {
    flex: 1,
    backgroundColor: "#3E3E3E",
  },
  scrollableScreen: {
    flex: 1,
    padding: 10,
  },
  search: {
    marginBottom: 10,
  },
  searchContent: {
    backgroundColor: "transparent",
  },

  selectedUsers: {
    flexGrow: 0,
    paddingHorizontal: 10,
  },
  userBadge: {
    marginRight: 10,
    alignItems: "center",
  },
  unselectUserButton: {
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 100,
    backgroundColor: "white",
    borderRadius: 1000,
  },
  userBadgeName: {
    width: UserBadgeSize,
    textAlign: "center",
  },

  table: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#3E3E3E",
    borderRadius: 10,
    // borderColor: 'grey',
    // borderWidth: 1,
  },
  tableHeader: {
    padding: 10,
  },
  tableHeaderLabel: {
    paddingRight: 10,
    fontWeight: "bold",
    color: "#0B82DC",
  },
  row: {
    flexDirection: "row",
    // paddingVertical: 10,
    padding: 10,
    // paddingHorizontal: 20,
    margin: 10,
    // borderTopColor: 'lightgrey',
    borderColor: "#2e2e2e",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2e2e2e",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  showMore: {
    paddingVertical: 10,
    borderTopColor: "lightgrey",
    borderTopWidth: 1,
  },
  showMoreText: {
    color: "gray",
    textAlign: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowAvatar: {
    marginRight: 10,
  },
  alreadyAdded: {
    color: "grey",
  },
  membersCount: {
    color: "grey",
  },
  noItems: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noItemsText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "gray",
    fontSize: 22,
  },
  donetext1: {
    backgroundColor: "#3d3d3d",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  DoneText: {
    fontSize: 7,
    color: "#0B82DC",
    // backgroundColor: 'black',
    position: "absolute",
    top: 15,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    marginLeft: 8,
    borderColor: "#FFFFFF",
    fontWeight: "bold",
    textShadowColor: "rgba(240,240,255,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#FFFFFF",
  },
  temText: {
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  hexagon: {
    width: 100,
    height: 25,
    position: "absolute",
    right: -35,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hexagonInner: {
    width: 48,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#08E5DF",
  },
  hexagonAfter: {
    position: "absolute",
    bottom: -14,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 24,
    borderLeftColor: "transparent",
    borderRightWidth: 24,
    borderRightColor: "transparent",
    borderTopWidth: 15,
    borderTopColor: "#08E5DF",
  },
  hexagonBefore: {
    position: "absolute",
    top: -15,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 24,
    borderLeftColor: "transparent",
    borderRightWidth: 24,
    borderRightColor: "transparent",
    borderBottomWidth: 15,
    borderBottomColor: "#08E5DF",
  },
  hexagon1: {
    width: 100,
    height: 25,
    position: "absolute",
    right: -35,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hexagonInner1: {
    width: 48,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B82DC",
  },
  hexagonAfter1: {
    position: "absolute",
    bottom: -14,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 24,
    borderLeftColor: "transparent",
    borderRightWidth: 24,
    borderRightColor: "transparent",
    borderTopWidth: 15,
    borderTopColor: "#0B82DC",
  },
  hexagonBefore1: {
    position: "absolute",
    top: -15,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 24,
    borderLeftColor: "transparent",
    borderRightWidth: 24,
    borderRightColor: "transparent",
    borderBottomWidth: 15,
    borderBottomColor: "#0B82DC",
  },
});
