//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  ToastAndroid,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import AutoImage from "react-native-autosize-image";

import { reactive } from "common/reactive";
import { Monitors } from "models/app/Monitors";
import {
  ActivityType,
  GoalOrChallenge,
  GoalTarget,
  ActivityStatus,
  getMetricName,
  getMetricMaxMeasuringText,
  getMetricMeasureText,
  getGoalChallengeTimeInfo,
  ChallengeMemberType,
  getMetricValueString,
} from "models/data/GoalOrChallenge";
import { GoalChallengeList } from "models/app/GoalsAndChallenges";
import { MainBlueColor, LightBlueColor, GrayColor } from "components/Theme";
import { HexagonChallengeMetricsViewer } from "./HexagonChallengeMetricsViewer";
import { HexagonGoalProgressViewer } from "./HexagonGoalProgressViewer";
import { doAsync } from "common/doAsync";
import { App } from "models/app/App";
import { LeaderGroup } from "models/data/GoalChallengeDetailsModel";
import { UserInfo } from "models/data/UserInfo";
import { UserAvatarSize } from "components/CommentInput";
import UserDummy from "assets/images/user-dummy.png";
import ActivityImage from "assets/icons/act/act.png";
import { Neomorph } from "react-native-neomorph-shadows";

interface GoalsAndChallengesListProps {
  list: GoalChallengeList;
  scrollToTop?: boolean;
  header?: {
    onPendingPress: () => void;
    onCompletedPress: () => void;
  };
  listEmptyText?: string;
  short?: boolean;
  listss?: string;
}

export const GoalsAndChallengesList = (
  p: GoalsAndChallengesListProps
): React.ReactElement => {
  const listViewRef: React.Ref<FlatList<any>> = React.useRef(null);
  const [previousScrollToTopStamp, setPreviousStamp] = React.useState(0);
  const list = p.list;
  const listss = p.listss;


  
  
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  // const windowHeight = Dimensions.get("window").height;
  return reactive(() => {
    if (p.scrollToTop && listViewRef.current !== null) {
      if (previousScrollToTopStamp !== list.scrollToTopStamp) {
        setPreviousStamp(list.scrollToTopStamp);
        listViewRef.current.scrollToOffset({ offset: 0, animated: false });
      }
    }
    const listEmpty: JSX.Element | undefined =
      p.listEmptyText !== undefined ? (
        <View style={styles.noItems}>
          <Neomorph
            inner // <- enable shadow inside of neomorph
            style={{
              shadowRadius: 1,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 4, height: 4 },
              elevation: 7,
              backgroundColor: "#f7f7f7",
              justifyContent: "center",
              alignItems: "center",
              width: (windowWidth / 100) * 90,
              height: (windowWidth / 100) * 100,
            }}
          >
            <Text style={styles.noItemsText}>{p.listEmptyText}</Text>
          </Neomorph>
        </View>
      ) : undefined;
    return (
      <>
        {listss ? (
          <Neomorph
            inner // <- enable shadow inside of neomorph
            style={{
              shadowRadius: 1,
              borderRadius: 3,
              shadowColor: "#000",
              shadowOffset: { width: 4, height: 4 },
              elevation: 7,
              backgroundColor: "#f7f7f7",
              width: (windowWidth / 100) * 80,
              height: (windowHeight / 100) * 95,
             }}>
            <FlatList
              ref={listViewRef}
              style={{
                width: (windowWidth / 100) * 68,
                backgroundColor: "transparent",
              }}
              data={list.items}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <GoalChallengeItem
                  item={item}
                  short={p.short}
                  listss={p.listss}
                  status={list.activityStatus}
                />
              )}
              keyExtractor={getItemKey}
              // ListHeaderComponent={listHeader}
              ListEmptyComponent={listEmpty}
              refreshing={Monitors.Refreshing.isActive}
              onRefresh={() => doAsync(list.loadItems)}
              onEndReachedThreshold={0.5}
              onEndReached={() =>
                doAsync(async () => {
                  if (list.hasMoreItems()) {
                    await list.loadMoreItems();
                    listViewRef.current?.flashScrollIndicators();
                  }
                })
              }
            />
          </Neomorph>
        ) : (
          <Neomorph
            inner // <- enable shadow inside of neomorph
            style={{
              shadowRadius: 1,
              borderRadius: 3,
              shadowColor: "#000",
              shadowOffset: { width: 4, height: 4 },
              elevation: 7,
              backgroundColor: "#f7f7f7",
              justifyContent: "center",
              alignItems: "center",
              width: (windowWidth / 100) * 80,
              height: (windowHeight / 100) * 50,
              paddingBottom: 5,
              paddingHorizontal: 10,
            }}
          >
            <FlatList
              ref={listViewRef}
              style={{
                width: (windowWidth / 100) * 75,
                backgroundColor: "transparent",
              }}
              data={list.items}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <GoalChallengeItem
                  item={item}
                  short={p.short}
                  listss={p.listss}
                  status={list.activityStatus}
                />
              )}
              keyExtractor={getItemKey}
              // ListHeaderComponent={listHeader}
              ListEmptyComponent={listEmpty}
              refreshing={Monitors.Refreshing.isActive}
              onRefresh={() => doAsync(list.loadItems)}
              onEndReachedThreshold={0.5}
              onEndReached={() =>
                doAsync(async () => {
                  if (list.hasMoreItems()) {
                    await list.loadMoreItems();
                    listViewRef.current?.flashScrollIndicators();
                  }
                })
              }
            />
          </Neomorph>
        )}
      </>
    );
  });
};

function getItemKey(item: GoalOrChallenge, _index: number): string {
  return item._id + item.updatedAt;
}

const styles = StyleSheet.create({
  headerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: GrayColor,
    marginHorizontal: 20,
    margin: 15,
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
  arrow: {
    paddingHorizontal: 5,
  },
  noItems: {
    // marginTop: 20,
    // paddingHorizontal: 20,
    alignItems: "center",
  },
  noItemsText: {
    marginTop: 20,
    marginHorizontal: 10,
    // textAlign: 'center',
    color: "#707070",
    fontSize: 10,
  },
});

export function GoalChallengeItem(p: {
  item: GoalOrChallenge;
  short?: boolean;
  status: ActivityStatus;
  listss?: string;
}): JSX.Element {
  return reactive(() => {
    const isGoal: boolean = p.item.gncType === ActivityType.Goal;

    let statusImage: JSX.Element | undefined = undefined;
    let goalCompletionStatus: JSX.Element | undefined = undefined;
    let challengeLeader: JSX.Element | undefined = undefined;
    let challengeShortMetrics: JSX.Element | undefined = undefined;

    if (isGoal) {
      const target: GoalTarget | undefined =
        p.item.target !== undefined ? p.item.target[0] : undefined;
      const score: number = p.item.totalScore ?? 0;
      const scorePercent: number = p.item.scorePercentage ?? 0;
      const totalGoalTarget: number = p.item.isPerPersonGoal
        ? (target?.value ?? 0) * p.item.memberCount
        : target?.value ?? 0;
      const goalStatusText: string =
        p.status === ActivityStatus.Completed
          ? scorePercent < 100
            ? "Goal Incomplete"
            : "Goal Complete"
          : `${scorePercent.toFixed(0)}% Complete`;
      goalCompletionStatus = (
        <>
          {target && (
            <Text style={{ fontSize: 14 }}>
              Goal |{" "}
              {getMetricValueString(target.matric, totalGoalTarget) +
                " " +
                getMetricMeasureText(target.matric)}
            </Text>
          )}
          <Text style={{ fontSize: 14 }}>Status | {goalStatusText}</Text>
        </>
      );
      if (!p.short && target !== undefined) {
        // TODO
        statusImage = (
          <View style={{ width: "55%", alignSelf: "flex-end" }}>
            <HexagonGoalProgressViewer
              metric={target.matric}
              score={score}
              percentage={scorePercent}
              valueFontSize={12}
              metricFontSize={11}
            />
          </View>
        );
      }
    } else {
      // Challenge
      if (p.status !== ActivityStatus.Upcoming) {
        let leaderPic: ImageSourcePropType;
        let name: string;
        let address: string | undefined;
        if (p.item.leaderType === ChallengeMemberType.User) {
          const leader = p.item.leader as UserInfo;
          leaderPic = leader.profile_pic
            ? { uri: leader.profile_pic }
            : UserDummy;
          name =
            (leader.first_name ? leader.first_name + " " : "") +
            leader.last_name;
          address =
            leader.address !== undefined ? leader.address.city : undefined;
        } else {
          // ChallengeMemberType.Team
          const leader = p.item.leader as LeaderGroup;
          leaderPic = leader.image ? { uri: leader.image } : UserDummy;
          name = leader.name;
          address = undefined;
        }
        challengeLeader = (
          <View style={itemStyles.leader}>
            <AutoImage
              source={leaderPic}
              mainAxisSize={UserAvatarSize}
              fallbackSource={UserDummy}
              style={itemStyles.leaderPhoto}
            />
            <View style={itemStyles.leaderInfo}>
              <Text
                style={itemStyles.Leadername}
                lineBreakMode="clip"
                numberOfLines={1}
              >
                Leader{" "}
              </Text>
              <Text style={itemStyles.Leadername}>{name}</Text>
              {address !== undefined && (
                <Text style={itemStyles.Leadername}>{address}</Text>
              )}
            </View>
          </View>
        );
      }
      if (!p.short) {
        statusImage =
          p.item.myScore && p.item.myScore.length ? (
            <HexagonChallengeMetricsViewer
              metric={p.item.matric}
              score={p.item.myScore[0]}
              valueFontSize={12}
              metricFontSize={11}
            />
          ) : undefined;
      } else {
        // short
        challengeShortMetrics = (
          <Text>
            {p.item.matric
              ?.map(
                (m) => getMetricMaxMeasuringText(m) + " " + getMetricName(m)
              )
              .join(", ")}
          </Text>
        );
      }
    }

    let joinStatusButton: JSX.Element | undefined = undefined;
    const isJoined = p.item.isJoined;
    const isPast = p.status === ActivityStatus.Completed;
    const isUpcoming = p.status === ActivityStatus.Upcoming;
    if (!isPast && (!isJoined || isUpcoming)) {
      const joinText: string = isJoined ? "Joined" : "Join";
      const onPress = isJoined
        ? undefined
        : () =>
            doAsync(async () => {
              const message: string = await App.goalsAndChallenges.join(
                p.item.gncType,
                p.item._id,
                p.item
              );
              ToastAndroid.show(message, ToastAndroid.SHORT);
            });
      joinStatusButton = (
        <Pressable
          style={[
            itemStyles.joined,
            {
              backgroundColor: isJoined ? LightBlueColor : MainBlueColor,
              alignSelf: isUpcoming ? "flex-end" : "flex-start",
              marginTop: isUpcoming ? 0 : 20,
              paddingHorizontal: isUpcoming ? 15 : 20,
            },
          ]}
          onPress={onPress}
        >
          <Text style={itemStyles.joinText}>{joinText}</Text>
        </Pressable>
      );
    }

    // TODO: call global App "timer" state
    const now: number = Date.now();
    const timeInfo: string = getGoalChallengeTimeInfo(
      p.item.startDate,
      p.item.endDate,
      p.status,
      now
    );
    const activityTypeText: string = p.item.getTypeName();
    const typeLogoSource: ImageSourcePropType =
      p.item?.anyActivity || p.item?.activityTypes.length > 1
        ? ActivityImage
        : { uri: p.item.activityTypes[0]?.logo };
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
    const startDateStamp = new Date(p.item.startDate);
    const startDate =
      monthNames[startDateStamp.getMonth()] +
      " " +
      startDateStamp.getDate() +
      "," +
      startDateStamp.getFullYear();

    const endDateStamp = new Date(p.item.endDate);
    const endDate =
      monthNames[endDateStamp.getMonth()] +
      " " +
      endDateStamp.getDate() +
      "," +
      endDateStamp.getFullYear();

    return (
      <>
        <Pressable
          style={itemStyles.item}
          onPress={() =>
            doAsync(async () => {
              if (isGoal)
                await App.goalsAndChallenges.openGoalDetails(
                  p.item._id,
                  p.item
                );
              // Challenge
              else
                await App.goalsAndChallenges.openChallengeDetails(
                  p.item._id,
                  p.item
                );
            })
          }
        >
          <View style={itemStyles.head}>
            <Text style={itemStyles.name}>{p.item.name}</Text>
            <Image
              source={typeLogoSource}
              tintColor={MainBlueColor}
              style={itemStyles.logo}
            />
          </View>
          <View style={itemStyles.body}>
            <View style={itemStyles.main}>
              <Text>{activityTypeText}</Text>

              <View>
                <Text style={{ width: "100%", fontSize: 10 }}>
                  Tēmates | {p.item.memberCount}
                </Text>
                <Text style={itemStyles.goaltext}>{goalCompletionStatus}</Text>
                <Text style={itemStyles.goaltext}>{challengeShortMetrics}</Text>
                <Text style={{ color: "#707070", fontSize: 12, width: "100%" }}>
                  {timeInfo}
                </Text>

                <Text style={itemStyles.datetext}>
                  {startDate} - {endDate}
                </Text>
              </View>

              {statusImage && (
                <View style={itemStyles.statusImage}>{statusImage}</View>
              )}
            </View>
            {challengeLeader}
            {joinStatusButton}
          </View>
        </Pressable>
      </>
    );
  });
}

const LeaderImageSize = 50;

const itemStyles = StyleSheet.create({
  item: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    margin: 15,
    shadowColor: "#000",
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.29,
    shadowRadius: 5.65,
    elevation: 7,
  },
  head: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goaltext: {
    color: "#707070",
    fontSize: 10,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    // width: "100%"
  },
  main: {
    flex: 1,
    display: "flex",
  },
  statusImage: {
    flex: 1,
    // marginTop: 10,
  },
  name: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#707070",
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  leader: {
    flex: 1,
    // marginTop: 10,
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 25,
  },
  leaderPhoto: {
    height: LeaderImageSize,
    width: LeaderImageSize,
    borderRadius: LeaderImageSize,
    resizeMode: "cover",
  },
  leaderInfo: {
    // marginLeft: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Leadername: {
    fontSize: 10,
    color: "#707070",
  },
  datetext: {
    color: MainBlueColor,
    fontSize: 12,
    width: "100%",
  },
  joined: {
    borderRadius: 100,
    paddingVertical: 5,
  },
  joinText: {
    color: "white",
    fontSize: 16,
  },
});
