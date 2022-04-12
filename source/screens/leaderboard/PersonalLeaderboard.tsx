//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { reactive } from "common/reactive";
import { StyleSheet, View, Pressable, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ref } from "reactronic";
import Icon from "react-native-vector-icons/FontAwesome5";
import { ScrollView } from "react-native-gesture-handler";
import { DashboardStackPropsPerPath } from "navigation/params";
import { InputBadge } from "components/InputBadge";
import { Hexagon } from "components/Hexagon/Hexagon";
import { App } from "models/app/App";
import { UserInfo } from "models/data/UserInfo";
import { SwipeRow } from "react-native-swipe-list-view";
import { Avatar } from "components/Avatar";
import { MainBlueColor } from "components/Theme";
import { showUserDetails } from "screens/profile/OtherUser";
import { doAsync } from "common/doAsync";
import { ChallengeMemberType } from "models/data/GoalOrChallenge";
import { LeaderGroup } from "models/data/GoalChallengeDetailsModel";
import { useNavigation } from "@react-navigation/native";

export const PersonalLeaderboard = (
  p: StackScreenProps<DashboardStackPropsPerPath>
): React.ReactElement => {
  return reactive(() => {
    const leaderboard = App?.leaderboard;
    const stored = App?.leaderboard.stored;
    return (
      <SafeAreaView style={styles.page}>
        {stored ? (
          <>
            <View style={[styles.pageHeader, styles.card]}>
              <InputBadge
                placeholder="Search"
                icon="search"
                model={Ref.to(leaderboard).search}
                style={styles.search}
              />
              <Pressable
                style={styles.addButton}
                onPress={() =>
                  doAsync(async () => {
                    await App.addTemates.open({
                      tematesToAddRef: Ref.to(App?.leaderboard).tematesToAdd,
                      disabledTematesRef: Ref.to(App?.leaderboard.stored)?.data, // disable already added temates
                      onApply: async () => {
                        await App.leaderboard.addTematesToLeaderboard();
                      },
                    });
                  })
                }
              >
                <Icon name="user-plus" size={24}></Icon>
              </Pressable>
            </View>

            <ScrollView style={styles.pageScrollableContent}>
              <View style={styles.card}>
                <PersonalLeaderCard
                  topScoreMember={stored.topScoreMember}
                  myRank={stored.myRank}
                />
              </View>

              {stored.data ? (
                <View style={[styles.card, styles.table]}>
                  <View style={styles.row}>
                    <Text style={[styles.columnHeader, styles.rank]}>Rank</Text>
                    <Text style={[styles.columnHeader, styles.temate]}>
                      Tēmate
                    </Text>
                    <Text style={[styles.columnHeader, styles.score]}>
                      Score
                    </Text>
                  </View>

                  {stored.data.map((user) => {
                    if (user.user_id === stored.myRank?.user_id)
                      return LeaderboardRow(user);
                    else return SwipeableLeaderboardRow(user);
                  })}
                </View>
              ) : null}
            </ScrollView>
          </>
        ) : null}
      </SafeAreaView>
    );
  });
};

export function PersonalLeaderList(p: {}): JSX.Element {
  const navigation = useNavigation();
  const stored = App?.leaderboard.stored;
  const lists = stored?.data?.slice(0, 4);
  return (
    <>
      {lists?.map((user) => {
        const userRow =
          user.user_id == App.leaderboard?.stored?.myRank?.user_id;
        return (
          // <View
          //   style={{
          //     marginTop:5,
          //     display: "flex",
          //     flexDirection: "row",
          //     overflow: "hidden",
          //     justifyContent: "center",
          //     alignItems: "center",
          //   }}
          // >
          //   <View style={userRow ? styles.leaderBadge : styles.listBadge}>
          //     <Text
          //       style={[
          //         styles.rankText,
          //         { color: userRow ? "white" : MainBlueColor },
          //       ]}
          //     >
          //       {user.rank}
          //     </Text>
          //   </View>
          //   {!userRow && (
          //     <Avatar
          //       source={user.profile_pic}
          //       size={UserAvatarSize}
          //       style={styles.userAvatar}
          //     />
          //   )}
          //   <Text style={styles.userName} numberOfLines={1}>
          //     {user.first_name} {user.last_name}
          //   </Text>
          // </View>
          <View
          style={{
            flexWrap:"wrap",
            overflow:'hidden',
            marginTop:10,
          }}
        >
         <View style={{flexDirection: "row"}}>
         <View style={userRow ? styles.leaderBadge : styles.listBadge}>
            <Text
              style={[
                styles.rankText,
                { color: userRow ? "white" : MainBlueColor },
              ]}
            >
              {user.rank}
            </Text>
          </View>
          {!userRow && (
            <Avatar
              source={user.profile_pic}
              size={UserAvatarSize}
              style={styles.userAvatar}
            />
          )}
          <Text style={styles.userName} numberOfLines={1}>
            {user.first_name} {user.last_name}
          </Text>
         </View>
        </View>

        );
      })}
      <Text
        style={styles.allText}
        onPress={() => {
          navigation.navigate("Leaderboard");
        }}
      >
        All..
      </Text>
    </>
  );
}

export function PersonalLeaderCard(p: {
  topScoreMember?: UserInfo | LeaderGroup;
  leaderType?: ChallengeMemberType;
  myRank?: UserInfo;
  myRankPlaceholder?: JSX.Element;
}): JSX.Element {
  const leaderType = p.leaderType ?? ChallengeMemberType.User;
  return (
    <View style={styles.leaderCard}>
      {p.topScoreMember ? (
        <>{LeaderBadge(p.topScoreMember, leaderType)}</>
      ) : null}
      {UserBadge(p.myRank, p.myRankPlaceholder)}
    </View>
  );
}

function LeaderBadge(
  topScoreMember: UserInfo | LeaderGroup,
  leaderType: ChallengeMemberType
): React.ReactElement {
  let image: string | undefined;
  let name: string;
  if (leaderType === ChallengeMemberType.User) {
    const leader = topScoreMember as UserInfo;
    image = leader.profile_pic;
    name =
      (leader.first_name ? leader.first_name + " " : "") + leader.last_name;
  } else {
    // ChallengeLeaderType.Team
    const leader = topScoreMember as LeaderGroup;
    image = leader.image;
    name = leader.name;
  }
  return (
    <View style={styles.leaderInfo}>
      <Text style={styles.avatarName}>Leader</Text>
      <Avatar
        source={image}
        size={LeaderAvatarSize}
        style={[styles.leaderAvatar, styles.leader]}
      />
      <Text style={styles.userName}> {name}</Text>
    </View>
  );
}

function UserBadge(
  myRank?: UserInfo,
  userN?: UserInfo,
  placeholder?: JSX.Element
): React.ReactElement {
  return (
    <View style={styles.leaderInfo}>
      <Text style={styles.avatarName}>You</Text>
      {myRank ? (
        <>
          <View style={styles.leaderResult}>
            <Text style={{ color: "white" }}>{myRank.rank}</Text>
          </View>
        </>
      ) : (
        placeholder
      )}
    </View>
  );
}

function SwipeableLeaderboardRow(user: UserInfo): React.ReactElement {
  return (
    <SwipeRow key={user.user_id} rightOpenValue={-75} disableRightSwipe>
      {LeaderboardRowControl(user)}
      {LeaderboardRow(user)}
    </SwipeRow>
  );
}

function LeaderboardRowControl(user: UserInfo): React.ReactElement {
  return (
    <View style={styles.rowControl}>
      <Pressable
        style={styles.rowControlRightButton}
        onPress={() => deleteFromLeaderboard(user)}
      >
        <Text style={styles.rowControlText}>Delete</Text>
      </Pressable>
    </View>
  );
}

function deleteFromLeaderboard(user: UserInfo): void {
  Alert.alert("", "Are you sure to remove this tēmate from leaderboard?", [
    { text: "No" },
    {
      text: "Yes",
      onPress: () =>
        doAsync(async () => {
          await App.leaderboard.removeFromLeaderboard(user);
          await App.leaderboard.stored?.load();
        }),
    },
  ]);
}

function LeaderboardRow(user: UserInfo): React.ReactElement {
  return (
    <Pressable
      key={user.user_id}
      style={styles.row}
      onPress={() => {
        if (user.user_id !== App.leaderboard?.stored?.myRank?.user_id) {
          showUserDetails(user);
        }
      }}
    >
      <View style={[styles.rank, styles.hex]}>
        <Hexagon
          columns={1}
          rows={1}
          textColor={MainBlueColor}
          stroke={MainBlueColor}
          strokeWidth={1}
          contentImageWidth={30}
          cells={[{ fitStroke: true, content: { h2: user.rank?.toString() } }]}
        />
      </View>
      <View style={styles.temate}>
        <Avatar
          source={user.profile_pic}
          size={UserAvatarSize}
          style={styles.userAvatar}
        />
        <View style={styles.temateInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.first_name} {user.last_name}
          </Text>
          {user.address && (user.address.city || user.address.country) ? (
            <View style={styles.location}>
              <Icon
                name="map-marker-alt"
                size={12}
                style={styles.locationIcon}
              ></Icon>
              <Text>
                {user.address.city ? user.address.city : null}
                {user.address.city && user.address.country ? ", " : null}
                {user.address.country ? user.address.country : null}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <Text style={[styles.score, styles.scoreValue]}>{user.score}</Text>
    </Pressable>
  );
}

const LeaderAvatarSize = 20;
const LeaderResultSize = 20;
const LeaderAvatarBorderWidth = 2;
const UserAvatarSize = 15;

const styles = StyleSheet.create({
  page: {
    width: "100%",
    height: "100%",
    backgroundColor: "#88C8EF",
    padding: 5,
  },
  card: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    backgroundColor: "white",
    marginBottom: 10,
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  search: {
    flex: 1,
    marginRight: 15,
  },
  addButton: {},

  pageScrollableContent: {},
  leaderCard: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "white",
    // height:70
    // alignItems: 'flex-start',
  },

  leaderInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  leaderAvatar: {
    borderWidth: LeaderAvatarBorderWidth,
    borderColor: "purple",
  },
  leader: {
    borderColor: MainBlueColor,
  },
  leaderAvatarContainer: {
    height: LeaderAvatarSize,
    position: "relative",

    justifyContent: "flex-end",
  },
  avatarName: {
    textAlign: "center",
    color: "#0B82DC",
    width: "100%",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
   },
  allText: {
    textAlign: "right",
    color: "#0B82DC",
    width: "100%",
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "capitalize",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#fff",
  },
  leaderResult: {
    alignItems: "center",
    justifyContent: "center",
    width: LeaderResultSize,
    height: LeaderResultSize,
    borderWidth: LeaderAvatarBorderWidth,
    borderRadius: LeaderResultSize / 2,
    borderColor: "purple",
    backgroundColor: "purple",
  },
  leaderBadge: {
    alignItems: "center",
    // justifyContent: "center",
    width: 15,
    height: 15,
    // right: 5,
    // marginLeft:20,
    borderRadius: 20 / 2,
    borderColor: "purple",
    backgroundColor: "purple",
    // flexWrap: 'nowrap',
  },
  listBadge: {
    // alignItems: "center",
    // justifyContent: "center",
    // width: LeaderResultSize,
    // height: LeaderResultSize,
  },
  delimiter: {
    width: 1,
    // height: 40,
    backgroundColor: "gray",
    opacity: 0.5,
    alignSelf: "center",
  },

  table: {},
  row: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "white",
    flexDirection: "row",
  },
  columnHeader: {
    textTransform: "uppercase",
  },
  rowControl: {
    height: "100%",
  },
  rowControlRightButton: {
    flex: 1,
    backgroundColor: "red",
    paddingHorizontal: 15,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  rowControlText: {
    color: "white",
  },

  rank: {
    width: 50,
    textAlign: "center",
  },
  temate: {
    flex: 1,
    marginLeft: 15,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  score: {
    width: 50,
    textAlign: "right",
    textAlignVertical: "center",
  },
  hex: {
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  userAvatar: {
    // marginRight: 0,
  },
  temateInfo: {
    flex: 1,
  },
  userName: {
    color: "black",
    // fontWeight: 'bold',
    fontSize: 8,
    marginTop:2,
    marginLeft:1,
 
  },
  location: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 5,
  },
  scoreValue: {
    color: MainBlueColor,
  },
  hexagonText: {
    fontSize: 15,
    color: "#0B82DC",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#fff",
  },
  rankText: {
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    shadowColor: "black",
    fontWeight: "600",
    fontSize:12,
    
  },
});
