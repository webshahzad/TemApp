//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { reactive } from "common/reactive";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  ToastAndroid,
  RefreshControl,
  Alert,
  Image,
  Dimensions,
  ImageBackground
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { RootStackPropsPerPath } from "navigation/params";
import {
  ActivityStatus,
  ChallengeMemberType,
  ChallengeType,
  getGoalChallengeTimeInfo,
  getMetricMeasureTextForScoreTable,
  Metrics,
} from "models/data/GoalOrChallenge";
import { MainBlueColor, LightBlueColor, Theme } from "components/Theme";
import { doAsync } from "common/doAsync";
import { LeaderGroup } from "models/data/GoalChallengeDetailsModel";
import { UserInfo } from "models/data/UserInfo";
import { App } from "models/app/App";
import { standalone, Transaction } from "reactronic";
import { populate } from "common/populate";
import { DetailsRightHeader } from "./DetailsRightHeader";
import {
  Details,
  Fundraising,
  GoalChallengeDetailsPropsPerPath,
  ScoreRow,
} from "./GoalDetails";
import { Chatter } from "./Chatter";
import { styles } from "./GoalDetails"; // Imported styles
import { LeaderCard } from "screens/leaderboard/Leaderboard";
import { HexagonTargetSelector } from "./HexagonTargetSelector";
import { TargetMetricsManager } from "models/app/TargetMetricsManager";
import { Monitors } from "models/app/Monitors";
import { ChatHeader } from "components/Header";
import CircularProgress from "components/CircularProgress";
import Dummy from "assets/images/user-dummy.png";
import donate from "assets/donate2.png";

import { TouchableOpacity } from "react-native";
import { Neomorph } from "react-native-neomorph-shadows";

const Tabs = createMaterialTopTabNavigator<GoalChallengeDetailsPropsPerPath>();

export function ChallengeDetails(
  p: StackScreenProps<RootStackPropsPerPath, "ChallengeDetails">
): JSX.Element | null {
  const model = App.goalsAndChallenges.currentGoalChallenge;
  // console.log("challengeModel--->>>>", JSON.stringify(model,null,2))
  if (!model) return null;

  React.useEffect(() => {
    p.navigation.setOptions({
      headerRight: (props) => (
        <DetailsRightHeader model={model} navigation={p.navigation} />
      ),
      headerStyle: {
        elevation: 0, // Android
        shadowOpacity: 0, // iOS
      },
    });
    return () => {
      App.goalsAndChallenges.resetCurrentGoalChallenge();
    };
  }, []);

  if (model.fundraising !== undefined) {
    return (
      <ChallengeProgress />

      // <Tabs.Navigator
      //   backBehavior='none'
      //   tabBarOptions={{
      //     indicatorStyle: {
      //       borderBottomColor: MainBlueColor,
      //       borderBottomWidth: 5,
      //     },
      //   }}
      // >
      //   <Tabs.Screen name='Progress' component={ChallengeProgress} options={{ title: 'Progress' }} />
      //   <Tabs.Screen name='Fundraising' component={Fundraising} initialParams={{ model }} options={{ title: 'Fundraising' }} />
      // </Tabs.Navigator>
    );
  } else {
    return <ChallengeProgress />;
  }
}

function ChallengeProgress(): JSX.Element | null {
  return reactive(() => {
    const model = App.goalsAndChallenges.currentGoalChallenge;
    console.log("model>>>",model?.chat)
    const fundraising = model?.fundraising;
    if (!model ) return null;

    const status: ActivityStatus = model.status;

    // const percent: number | undefined = fundraising.percent();
    const isDonateButtonVisible = status !== ActivityStatus.Completed;

    // const targetValue: string =
    //   fundraising.goalAmount !== undefined
    //     ? "$" + fundraising.goalAmount
    //     : "NO";
    // const collected = "$" + (fundraising.collectedAmount ?? 0);
    if (!model) return null;

    const metrics = model.matric ?? [];
    let scoreTitle: string;

    let metric: Metrics | Metrics[];
    if (metrics.length === 1) {
      // single metric
      metric = metrics[0];
      scoreTitle = getMetricMeasureTextForScoreTable(metric);
    } else {
      // multiple metrics are expanded
      metric = metrics;
      scoreTitle = "";
    }
    const isJoined = model.isJoined;

    const leader: UserInfo | LeaderGroup | undefined =
      status !== ActivityStatus.Upcoming ? model.leader : undefined;
    const isLeaderboardVisible: boolean = leader !== undefined;

    const targetMetrics = new TargetMetricsManager(metrics);

    let joinButton: JSX.Element | undefined = undefined;
    if (!isJoined || status === ActivityStatus.Upcoming) {
      const joinText: string = isJoined ? "Joined" : "Join";
      const buttonColor: string = isJoined ? LightBlueColor : MainBlueColor;
      const onPress = isJoined
        ? undefined
        : () =>
            doAsync(async () =>
              standalone(() =>
                Transaction.run(async () => {
                  const message: string = await App.goalsAndChallenges.join(
                    model.gncType,
                    model._id,
                    model.listItem
                  );
                  const updatedDetails =
                    await App.goalsAndChallenges.getDetails(
                      model.gncType,
                      model._id,
                      model.listItem
                    );
                  populate(model, updatedDetails);
                  ToastAndroid.show(message, ToastAndroid.SHORT);
                })
              )
            );
      joinButton = (
        <Pressable
          style={[styles.joinButton, { backgroundColor: buttonColor }]}
          onPress={onPress}
        >
          <Text style={{ color: "white", fontSize: 17 }}>{joinText}</Text>
        </Pressable>
      );
    }
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;

    const now: number = Date.now();
    const timeInfo: string = getGoalChallengeTimeInfo(
      model?.listItem?.startDate,
      model?.listItem?.endDate,
      status,
      now
    );
    const monthNames = [
      "",
      "Jan",
      "Feb",
      "March",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const startDateStamp = new Date(model?.listItem?.startDate);
    const startDate =
      monthNames[startDateStamp.getMonth()] +
      " " +
      startDateStamp.getDate() +
      "," +
      startDateStamp.getFullYear();
    
    const endDateStamp = new Date(model?.listItem?.endDate);
    const endDate =
      monthNames[endDateStamp.getMonth()] +
      " " +
      endDateStamp.getDate() +
      "," +
      endDateStamp.getFullYear();
    return (
      <SafeAreaView style={styles.screen}>
        <ChatHeader
          rightOnPress={() => App.goalsAndChallenges.editGoalOrChallenge(model)}
          rightIcon="edit"
        />
        <ScrollView
          style={styles.scrollable}
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={Monitors.Refreshing.isActive}
              onRefresh={() =>
                App.goalsAndChallenges.refreshCurrentGoalChallenge()
              }
            />
          }
        >
          <View style={styles.card1}>
            <View>
              <View style={styles.imageContainer}>
                <View>
                  <CircularProgress
                    trailColor="#000000b5"
                    // fill={completion}
                    fill={80}
                    barWidth={2}
                    radius={45}
                    strokeColor="#BF36BD"
                    styles={false}
                  >
                    <View style={[styles.containerimg]}>
                      <Pressable>
                        <Image
                          source={
                            // createGroup.imageUri
                            //   ? { uri: createGroup.imageUri }
                            //   :
                            Dummy
                          }
                          style={styles.image}
                        />
                      </Pressable>
                    </View>
                  </CircularProgress>
                </View>
              </View>
              {leader && (
                <View style={styles.card}>
                  <LeaderCard
                    topScoreMember={leader}
                    leaderType={model.leaderType}
                    myRank={isJoined ? model.myScoreInfo : undefined}
                    myRankPlaceholder={joinButton}
                  />
                </View>
              )}
            </View>
            <View>
              <Details model={model} />
            </View>
          </View>
          <View style={styles.detailTab}>
            <Text style={styles.tabText}>Test Goal </Text>
          </View>
          <View style={styles.detailTab}>
            <Text style={styles.tabText}>TĒMates | {model.memberCount}</Text>
          </View>
          <View style={styles.detailTab}>
            <Text style={styles.tabText}>
              DURATION | {startDate} - {endDate}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <View style={styles.detailTab}>
              <Text style={styles.tabText}>
                FUNDRAISING | $65.00 of $250 
                {/* FUNDRAISING | {collected} Of {targetValue} */}
               
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                void App.goalsAndChallenges.openDonationPage(model);
              }}
              style={styles.donate}
            >
              <Text style={{ color: "#f7f7f7" }}>DONATE</Text>
                          
            </TouchableOpacity>
          </View>

          {isJoined && (
            // <View style={styles.card}>
            <>
              <View style={styles.cardHead}>
                <Text style={styles.chatter}>Chatter</Text>
              </View>

              <Neomorph
                inner // <- enable shadow inside of neomorph
                style={{
                  margin:10,
                  borderRadius: 8,
                  shadowColor: "#fff",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 3.0,
                  elevation: 2,
                  backgroundColor: "#fff",
                  marginHorizontal: 25,
                  // justifyContent: "center",
                  // alignItems: "center",
                  width: (windowWidth / 100) * 90,
                  height: (windowHeight / 100) * 25,
                  paddingBottom: 20,
                }}
              >
                <Chatter model={model} />
              </Neomorph>
            </>
          )}

          {isLeaderboardVisible ? (
            // <View style={[styles.card, styles.lastCard]}>
            <View style={{ marginTop: 20 }}>
              <View style={styles.cardHead}>
                <Text style={styles.chatter}>Leaderboard</Text>
              </View>
              <Neomorph
                inner // <- enable shadow inside of neomorph
                style={{
                  borderRadius: 8,
                  shadowColor: "#fff",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 3.0,
                  elevation: 2,
                  backgroundColor: "#fff",
                  marginHorizontal: 25,
                  paddingTop: 20,
                  width: (windowWidth / 100) * 90,
                  height: (windowHeight / 100) * 40,
                  marginBottom: 30,
                }}> 
                <ScrollView>
                
                  {/* <View style={styles.table}> */}
                    {/* <View style={styles.row}>
                  <Text style={[styles.columnHeader, styles.rank]}>rank</Text>
                  <Text style={[styles.columnHeader, styles.temate]}>
                    {model.type === ChallengeType.TeamVsTeam ? "tēm" : "tēmate"}
                  </Text>
                  <Text style={[styles.columnHeader, styles.rank]}>score</Text>
                  <Text style={[styles.columnHeader, styles.score]}>
                    {scoreTitle}
                  </Text>
                </View> */}

                    {model.type === ChallengeType.UserVsUser &&
                      model.membersScore.map((userScore) => (
                        <ScoreRow
                          key={userScore.userId}
                          userScore={userScore}
                          type={ChallengeMemberType.User}
                          metric={metric}
                          showScoreHex
                        />
                      ))}
                    {model.type === ChallengeType.UserVsTeam &&
                      model.scoreBoard?.map((s) => (
                        <ScoreRow
                          key={s.userId}
                          userScore={s}
                          type={s.scoreType ?? ChallengeMemberType.User}
                          metric={metric}
                          showScoreHex
                        />
                      ))}
                    {model.type == ChallengeType.TeamVsTeam &&
                      model.teams?.map((teamScore) => (
                        <ScoreRow
                          key={teamScore.userId}
                          userScore={teamScore}
                          type={ChallengeMemberType.Team}
                          metric={metric}
                          showScoreHex
                        />
                      ))}
                    {model.needToLoadMoreMemberScore() && (
                      <Pressable
                        style={styles.showMore}
                        onPress={() =>
                          doAsync(async () =>
                            App.goalsAndChallenges.loadMoreDetailsScore(model)
                          )
                        }
                      >
                        <Text style={styles.showMoreText}>Show More</Text>
                      </Pressable>
                    )}
                  {/* </View> */}
                  </ScrollView>
              </Neomorph>
             
            </View>
          ) : (
            <View style={styles.card}>
              <HexagonTargetSelector
                lockMetric
                isChallenge
                targetManager={targetMetrics}
              />
              {joinButton}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  });
}
