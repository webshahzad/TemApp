//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, Pressable, Text, Alert,ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { DashboardStackPropsPerPath } from "navigation/params";
import { App } from "models/app/App";
import { UserInfo } from "models/data/UserInfo";
import { SwipeRow } from "react-native-swipe-list-view";
import { Avatar } from "components/Avatar";
import { MainBlueColor } from "components/Theme";
import { showUserDetails } from "screens/profile/OtherUser";
import { doAsync } from "common/doAsync";
import { ChallengeMemberType } from "models/data/GoalOrChallenge";
import { LeaderGroup } from "models/data/GoalChallengeDetailsModel";
import { Ref } from "reactronic";
import { ChatHeader } from "components/Header";
import { reactive } from 'common/reactive'
import  hexagon from "assets/images/honey-blue-border/honey-blue.png" 



export interface Leaderboard{
  loader: Leaderboard;

}

export const Leaderboard = (
  p: StackScreenProps<DashboardStackPropsPerPath>
): React.ReactElement => {
  return reactive(() => {
  const leaderboard = App.leaderboard;
  const stored = App.leaderboard.stored;

 
  
  return (
    <SafeAreaView style={styles.page}>
      {stored ? (
        <>
          <ChatHeader
            rightOnPress={() =>
              doAsync(async () => {
                await App.addTemates.open({
                  tematesToAddRef: Ref.to(App.leaderboard).tematesToAdd,
                  disabledTematesRef: Ref.to(App.leaderboard.stored)?.data, // disable already added temates
                  onApply: async () => {
                    await App.leaderboard.addTematesToLeaderboard();
                  },
                });
              })
            }
            rightIcon="plus"
          />

          <ScrollView style={styles.pageScrollableContent}>
            {stored.data ? (
              <View style={[styles.card, styles.table]}>
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
  })
}

export function LeaderCard(p: {
  topScoreMember?: UserInfo | LeaderGroup;
  leaderType?: ChallengeMemberType;
  myRank?: UserInfo;
  myRankPlaceholder?: JSX.Element;
}): JSX.Element {
  const leaderType = p.leaderType ?? ChallengeMemberType.User;
  return (
    <View style={styles.leaderCard}>
      {p.topScoreMember ? (
        <>
          {LeaderBadge(p.topScoreMember, leaderType)}
          {/* <View style={styles.delimiter} /> */}
        </>
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
  const leader = topScoreMember as UserInfo;
  const model = App.goalsAndChallenges.currentGoalChallenge;
  // if (!model) return null;
  return (
    <View style={styles.leaderContainer}>
      <View style={styles.leaderInfo}>
        <Avatar
          source={image}
          size={LeaderAvatarSize}
          style={[styles.leaderAvatar, styles.leader]}
        />
        <View>
        <Text style={styles.avatarName}>Leader</Text>
        <Text style={[styles.avatarName, {top:-8}]}>{name}</Text>
        </View>
      </View>
      <View>
      <Text
        style={styles.rankText}
      >
        YOU | {model?.myScoreInfo?.rank}
      </Text>
      </View>
    </View>
  );
}

function UserBadge(
  myRank?: UserInfo,
  placeholder?: JSX.Element
): React.ReactElement {
  return (
    // <View style={styles.leaderInfo}>
    //   <View style={styles.leaderAvatarContainer}>
    //     {myRank ? (
    <>
      {/* <Avatar
              source={myRank.profile_pic}
              size={LeaderAvatarSize}
              style={styles.leaderAvatar}
            />
            <View style={styles.leaderResult}>
              <Text>{myRank.rank}</Text>
            </View> */}
    </>
    //     ) : placeholder}
    //   </View>
    //   <Text style={styles.avatarName}>You</Text>
    // </View>
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
   <>
   
      {/* <View style={styles.rowControl}>
      <Pressable
        style={styles.rowControlRightButton}
        onPress={() => deleteFromLeaderboard(user)}>
        <Text style={styles.rowControlText}>Delete</Text>
      </Pressable>
    </View> */}

<View style={styles.rowControl}>
      <Pressable
        style={styles.rowControlRightButton}
        onPress={() =>  deleteFromLeaderboard(user)}>
        <Text style={styles.rowControlText}>Delete</Text>
      </Pressable>
    </View>
 
   </>
  );
}

function deleteFromLeaderboard(user: UserInfo): void {
  Alert.alert("", "Are you sure to remove this tēmate from leaderboard?", [
    { text: "No" },
    {
      text: "Yes",
      onPress: () =>
        doAsync(async () => {
          // const leaderboard = App.leaderboard.initializeStoredLeaderboard();
          await App.leaderboard.removeFromLeaderboard(user);
          await App.leaderboard.stored?.load();
           // leaderboard.load();        
          
         
         }),
    },
  ]);
}

function LeaderboardRow(user: UserInfo): React.ReactElement {
  const userRow = user.user_id == App.leaderboard?.stored?.myRank?.user_id;
  

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
      <View style={styles.mainView}>
        <View style={styles.mainView2}>
          <View style={[styles.rank, styles.hex]}>
            {userRow ? (
              <View style={styles.userStyle}></View>
            ) : (
              <View style={styles.hexagon}>
                <View style={styles.hexagonInner}>
                  <Text style={styles.hexagonText}>{user?.rank}</Text>
                </View>
                <View style={styles.hexagonBefore} />
                <View style={styles.hexagonAfter} />
              </View>

            )}
          </View>
          <View style={styles.temate}>
            {!userRow && (
              <Avatar
                source={user.profile_pic}
                size={UserAvatarSize}
                style={styles.userAvatar}
              />
            )}
            <View style={styles.temateInfo}>
              <View>
                {userRow ? (
                  <Text style={styles.userName} numberOfLines={1}>
                    You
                  </Text>
                ) : (
                  <Text style={styles.userName} numberOfLines={1}>
                    {user.first_name} {user.last_name} 
                  </Text>
                )}
              </View>
            </View>
          </View>        
              <View >
              <ImageBackground source={hexagon} style={{width:45,height:45}}>
              <Text style={styles.hexagonText1}>{user?.score}</Text>
              </ImageBackground>
              </View>
        </View>
      </View>
    </Pressable>

                );
}

const LeaderAvatarSize = 50;
const LeaderResultSize = 30;
const LeaderAvatarBorderWidth = 3;
const UserAvatarSize = 40;

const styles = StyleSheet.create({
  mainView: {
    // marginTop: 20,
    backgroundColor: "#f7f7f7",
    width: "100%",
    height: 70,
    // margin: 20,
    borderRadius: 10,
    shadowColor: "#000",
    paddingVertical: 20,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 5,
   
    
    
  },
  mainView2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  
  },

  page: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    padding: 5,
  },
  card: {
    padding: 15,
    marginBottom: 10,
  },

  input_view: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 5,
  },
  search: {
    flex: 1,
    marginRight: 15,
  },
  addButton: {
    marginRight: 10,
  },
  arroimage: {
    display: "flex",
    justifyContent: "flex-start",
  },
  leader_view: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  pageScrollableContent: {
    backgroundColor: "#f7f7f7",
  },
  leaderCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  leaderContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  leaderInfo: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  leaderAvatar: {
    borderWidth: LeaderAvatarBorderWidth,
    borderColor: "gray",
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
    color:'#707070',
    flex: 1,
    textAlignVertical: "center",
    textAlign: "left",
    marginLeft: 5,
    fontSize:12
    // marginTop: 5,
  },
  rankText:{
    fontWeight: "500",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    top:12,
    left:20,
    fontSize:16
  },
  leaderResult: {
    position: "absolute",
    right: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    width: LeaderResultSize,
    height: LeaderResultSize,
    borderWidth: LeaderAvatarBorderWidth,
    borderRadius: LeaderResultSize / 2,
    borderColor: "gray",
    backgroundColor: "white",
  },
  // delimiter: {
  //   width: 1,
  //   height: 40,
  //   backgroundColor: 'gray',
  //   opacity: 0.5,
  //   alignSelf: 'center',
  // },

  table: {},
  row: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "#f7f7f7",
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
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 15,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  rowControlText: {
    color: "red",
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
    marginRight: 10,
   
  },
  temateInfo: {
    flex: 1,
    marginBottom:20
    
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
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

  hexagon: {
    // width: 100,
    height: 25,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  hexagonInner: {
    width: 36,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  hexagonAfter: {
    position: "absolute",
    bottom: -3,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 18,
    borderLeftColor: "transparent",
    borderRightWidth: 18,
    borderRightColor: "transparent",
    borderTopWidth: 10,
    borderTopColor: "#fff",
  },
  hexagonBefore: {
    position: "absolute",
    top: -10,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 18,
    borderLeftColor: "transparent",
    borderRightWidth: 18,
    borderRightColor: "transparent",
    borderBottomWidth: 10,
    borderBottomColor: "#fff",
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

  hexagon1: {
    // width: 100,
    height: 25,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  hexagonInner1: {
    width: 36,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B82DC",
  },
  hexagonAfter1: {
    position: "absolute",
    bottom: -3,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 18,
    borderLeftColor: "transparent",
    borderRightWidth: 18,
    borderRightColor: "transparent",
    borderTopWidth: 10,
    borderTopColor: "#0B82DC",
  },
  hexagonBefore1: {
    position: "absolute",
    top: -10,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 18,
    borderLeftColor: "transparent",
    borderRightWidth: 18,
    borderRightColor: "transparent",
    borderBottomWidth: 10,
    borderBottomColor: "#0B82DC",
  },
  hexagonText1: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#fff",
    justifyContent:'center',
    alignItems:'center',
    marginTop:15,
    marginLeft:8,
  },
  userStyle: {
    backgroundColor: "#C117D9",
    width: 20,
    height: 20,
    left: 20,
    borderRadius: 10,
  },
});
