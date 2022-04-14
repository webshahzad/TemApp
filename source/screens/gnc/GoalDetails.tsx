//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react"
import { reactive } from "common/reactive"
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ToastAndroid,
  Dimensions,
  RefreshControl,
  ImageSourcePropType,
  Alert,
  TouchableOpacity,
} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"
import { SafeAreaView } from "react-native-safe-area-context"
import { StackScreenProps } from "@react-navigation/stack"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"

import { EmptyProps, RootStackPropsPerPath } from "navigation/params"
import {
  ActivityScore,
  ActivityStatus,
  ActivityType,
  ChallengeMemberType,
  EmptyGoalTarget,
  getGoalChallengeTimeInfo,
  getMetricMeasureText,
  getMetricMeasureTextForScoreTable,
  getMetricName,
  getMetricValueString,
  getMetricValueStringFromScore,
  GoalTarget,
  Metrics,
} from "models/data/GoalOrChallenge"
import { HexagonGoalProgressViewer } from "./HexagonGoalProgressViewer"
import {
  MainBlueColor,
  BlueBackground,
  LightBlueColor,
  GrayColor,
} from "components/Theme"
import { Hexagon } from "components/Hexagon/Hexagon"
import { CellCustomization } from "components/Hexagon/HexagonProps"
import { formatDate, formatGoalStartDate } from "common/datetime"
import { DefaultHexGradient } from "common/constants"
import { doAsync } from "common/doAsync"
import {
  ActivityGroup,
  GoalChallengeDetailsModel,
} from "models/data/GoalChallengeDetailsModel"
import { Avatar } from "components/Avatar"
import { App } from "models/app/App"
import { standalone, Transaction } from "reactronic"
import { populate } from "common/populate"
import { DetailsRightHeader } from "./DetailsRightHeader"
import { Chatter } from "./Chatter"
import { HexagonChallengeMetricsViewer } from "./HexagonChallengeMetricsViewer"
import { UserInfo } from "models/data/UserInfo"
import { Address } from "models/data/Address"
import { HexagonProgressViewer } from "./HexagonProgressViewer"
import { Monitors } from "models/app/Monitors"
import ActivityImage from "assets/icons/act/act.png"
import { ChatHeader } from "components/Header"
import { ShadowButton } from "components/ShadowButton"
import CircularProgress from "components/CircularProgress"
import Dummy from "assets/images/user-dummy.png"
import Modal from "react-native-modal"
import { Neomorph } from "react-native-neomorph-shadows"
// import Honey from "assets/images/honey-blue-border/honey.png"
import Polygon from "assets/Polygon.png"
import { TargetMetricsManager } from "models/app/TargetMetricsManager"
import { useNavigation } from "@react-navigation/native"

export type GoalChallengeDetailsPropsPerPath = {
  Progress: EmptyProps
  Fundraising: EmptyProps
  Temates: EmptyProps
}

const Tabs = createMaterialTopTabNavigator<GoalChallengeDetailsPropsPerPath>()

export function GoalDetails(
  p: StackScreenProps<RootStackPropsPerPath, "GoalDetails">
): JSX.Element | null {
  const model = App.goalsAndChallenges.currentGoalChallenge
  if (!model) return null

  React.useEffect(() => {
    // p.navigation.setOptions({
    //   headerRight: (props) => (
    //     <DetailsRightHeader model={model} navigation={p.navigation} />
    //   ),
    //   headerStyle: {
    //     elevation: 0, // Android
    //     shadowOpacity: 0, // iOS
    //   },
    // });
    return () => {
      App.goalsAndChallenges.resetCurrentGoalChallenge()
    }
  }, [])
  const navigation = useNavigation()
  return reactive(() => {
    return (
      <>
        <ChatHeader
          rightIcon="pencil"
          icons
          rightOnPress={() => App.goalsAndChallenges.editGoalOrChallenge(model)}
        />
        {/* <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 50,
        }}
      > */}
        {/* <ShadowButton
          BgColor={App.user?.isActivity ? "#0B82DC" : "#fff"}
          height={8}
          width={37}
          borderRadius={9}
          style={{ marginBottom: 10 }}
          onPress={() => {
            Transaction.run(() => {
              App.user.isActivity = true
              App.user.isFundrising = false
            })
          }}
          text="Activity"
          textColor={App.user.isActivity ? "#fff" : "black"}
        /> */}
        {/* <ShadowButton
          BgColor={App.user?.isFundrising ? "#0B82DC" : "#fff"}
          height={8}
          borderRadius={9}
          width={37}
          onPress={() => {
            Transaction.run(() => {
              App.user.isActivity = false
              App.user.isFundrising = true
            })
          }}
          style={{ marginBottom: 10 }}
          text="Fundraising"
          textColor={App.user.isFundrising ? "#fff" : "black"}
        /> */}
        {/* </View> */}
        <GoallDetails />
      </>
    )
  })
}

function GoalProgress(): JSX.Element | null {
  return reactive(() => {
    const model = App.goalsAndChallenges.currentGoalChallenge
    if (!model) return null

    const status: ActivityStatus = model.status
    const target: GoalTarget =
      model.target !== undefined && model.target.length
        ? model.target[0]
        : EmptyGoalTarget

    const score: number = model.totalScore ?? 0
    const scorePercent: number = model.scorePercentage ?? 0
    const isProgressVisible =
      status !== ActivityStatus.Upcoming && target !== undefined

    const totalGoalTarget: number = model.isPerPersonGoal
      ? target.value * model.memberCount
      : target.value

    const targetValue: string =
      getMetricValueString(target.matric, totalGoalTarget) +
      (target.matric === Metrics.TotalActivityTime
        ? ""
        : " " + getMetricMeasureText(target.matric))

    const valueFontSize: number = 16
    const infoCells: CellCustomization[] = [
      {
        content: {
          // TODO: value ???
          h1: targetValue,
          h1size: valueFontSize,
          h2: "GOAL",
          textColor: "white",
        },
        backgroundGradient: DefaultHexGradient,
      },
      {
        content: {
          h1: formatGoalStartDate(new Date(model.startDate)),
          h1size: valueFontSize,
          h2: "START",
          textColor: "white",
        },
        backgroundGradient: DefaultHexGradient,
      },
      {
        content: {
          h1: model.duration,
          h1size: valueFontSize,
          h2: "DURATION",
          textColor: "white",
        },
        backgroundGradient: DefaultHexGradient,
      },
    ]

    let joinButton: JSX.Element | null = null
    if (!model.isJoined || status === ActivityStatus.Upcoming) {
      const joinText: string = model.isJoined ? "Joined" : "Join"
      const buttonColor: string = model.isJoined
        ? LightBlueColor
        : MainBlueColor
      const onPress = model.isJoined
        ? undefined
        : () =>
          doAsync(async () =>
            standalone(() =>
              Transaction.run(async () => {
                const message: string = await App.goalsAndChallenges.join(
                  model.gncType,
                  model._id,
                  model.listItem
                )
                const updatedDetails =
                  await App.goalsAndChallenges.getDetails(
                    model.gncType,
                    model._id,
                    model.listItem
                  )
                populate(model, updatedDetails)
                ToastAndroid.show(message, ToastAndroid.SHORT)
              })
            )
          )
      joinButton = (
        <Pressable
          style={[styles.joinButton, { backgroundColor: buttonColor }]}
          onPress={onPress}
        >
          <Text style={{ color: "white", fontSize: 17 }}>{joinText}</Text>
        </Pressable>
      )
    }

    const windowWidth = Dimensions.get("window").width
    return (
      <SafeAreaView style={styles.screen}>
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
          {/* {isProgressVisible && ( */}
          <View style={styles.progressBlock}>
            <HexagonGoalProgressViewer
              score={score}
              metric={target.matric}
              percentage={scorePercent}
              huge
            />
          </View>
          {/* )} */}
          <View
            style={[
              styles.card,
              isProgressVisible ? { marginTop: -windowWidth / 4 } : undefined,
            ]}
          >
            <View style={styles.cardHead}>
              <Text>Chatter</Text>
            </View>
            {/* <Chatter model={model} /> */}
          </View>
          <View style={[styles.card, styles.lastCard]}>
            {/* <Details model={model} /> */}
            <View
              style={{ width: "70%", alignSelf: "center", marginBottom: 5 }}
            >
              <Hexagon
                columns={2}
                rows={2}
                removeLast
                cells={infoCells}
                stroke="gray"
                spacing={3}
              />
            </View>
            {joinButton}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  })
}

export function Fundraising(): JSX.Element | null {
  return reactive(() => {
    const model = App.goalsAndChallenges.currentGoalChallenge
    const fundraising = model?.fundraising

    if (!model || !fundraising) return null

    const status: ActivityStatus = model.status

    const percent: number | undefined = fundraising.percent()
    const isDonateButtonVisible = status !== ActivityStatus.Completed

    const targetValue: string =
      fundraising.goalAmount !== undefined
        ? "$" + fundraising.goalAmount
        : "NO"
    const collected = "$" + (fundraising.collectedAmount ?? 0)

    const valueFontSize: number = 16
    const infoCells: CellCustomization[] = [
      {
        content: {
          // TODO: value ???
          h1: targetValue,
          h1size: valueFontSize,
          h2: "GOAL",
          textColor: "white",
        },
        backgroundGradient: DefaultHexGradient,
      },
      {
        content: {
          h1: formatGoalStartDate(new Date(model.startDate)),
          h1size: valueFontSize,
          h2: "START",
          textColor: "white",
        },
        backgroundGradient: DefaultHexGradient,
      },
      {
        content: {
          h1: model.duration,
          h1size: valueFontSize,
          h2: "DURATION",
          textColor: "white",
        },
        backgroundGradient: DefaultHexGradient,
      },
    ]

    const windowWidth = Dimensions.get("window").width
    return (
      <SafeAreaView style={styles.screen}>
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
          <View style={styles.progressBlock}>
            <HexagonProgressViewer
              value={collected}
              percentage={percent}
              huge
            />
          </View>
          {isDonateButtonVisible && (
            <Pressable
              style={[
                styles.joinButton,
                { backgroundColor: MainBlueColor, marginTop: -windowWidth / 3 },
              ]}
              onPress={() => {
                void App.goalsAndChallenges.openDonationPage(model)
              }}
            >
              <Text style={{ color: "white", fontSize: 17 }}>Donate</Text>
            </Pressable>
          )}
          <View
            style={[
              styles.card,
              styles.lastCard,
              isDonateButtonVisible
                ? undefined
                : { marginTop: -windowWidth / 4 },
            ]}
          >
            <Details model={model} percentOverride={percent} />
            <View
              style={{ width: "70%", alignSelf: "center", marginBottom: 5 }}
            >
              <Hexagon
                columns={2}
                rows={2}
                removeLast
                cells={infoCells}
                stroke="gray"
                spacing={3}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  })
}

function GoalTemates(): JSX.Element | null {
  return reactive(() => {
    const model = App.goalsAndChallenges.currentGoalChallenge
    if (!model) return null

    const target: GoalTarget =
      model.target !== undefined && model.target.length
        ? model.target[0]
        : EmptyGoalTarget
    const scoreTitle: string = getMetricMeasureTextForScoreTable(target.matric)
    return (
      <View style={styles.screen}>
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
          <View style={styles.cards}>
            <Details model={model} />
          </View>
          <View style={[styles.card, styles.lastCard]}>
            <View style={styles.cardHead}>
              <Text style={{ fontSize: 16 }}>Tēmates</Text>
            </View>
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={[styles.columnHeader, styles.rank]}>rank</Text>
                <Text style={[styles.columnHeader, styles.temate]}>tēmate</Text>
                <Text style={[styles.columnHeader, styles.score]}>
                  {scoreTitle}
                </Text>
              </View>

              {model.membersScore.map((userScore) => {
                if (userScore.userInfo !== undefined)
                  return (
                    <ScoreRow
                      key={userScore.userInfo._id}
                      userScore={userScore}
                      type={ChallengeMemberType.User}
                      metric={target.matric}
                    />
                  )
                else return null
              })}
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
            </View>
          </View>
        </ScrollView>
      </View>
    )
  })
}

export function ScoreRow(p: {
  userScore: ActivityScore<UserInfo | ActivityGroup>
  type: ChallengeMemberType
  metric: Metrics | Metrics[]
  showScoreHex?: boolean
}): React.ReactElement | null {
  const [expanded, setExpanded] = React.useState(false)

  const { userScore, metric } = p
  const showScoreHex: boolean = p.showScoreHex ?? false

  if (userScore.userInfo === undefined) return null

  let scoreString: string
  if (userScore.score !== undefined) {
    const fract = userScore.score - Math.trunc(userScore.score)
    const fractString = fract.toString()
    if (fractString.length > 4) {
      scoreString = userScore.score.toFixed(2).toString()
    } else {
      // 0, 0.X or 0.XX
      scoreString = userScore.score?.toString()
    }
  } else {
    scoreString = "-"
  }

  let score: JSX.Element | undefined
  if (showScoreHex)
    score = (
      <View style={[styles.rank, styles.hex]}>
        <Hexagon
          columns={1}
          rows={1}
          textColor="black"
          stroke={MainBlueColor}
          strokeWidth={1}
          contentImageWidth={30}
          cells={[
            { fitStroke: true, content: { h2: scoreString, h2size: 12 } },
          ]}
        />
      </View>
    )
  else score = undefined

  let image: number | string | undefined
  let name: string
  let address: Address | undefined
  if (p.type === ChallengeMemberType.User) {
    const user = p.userScore.userInfo as UserInfo | undefined

    image = user?.profile_pic
    name = (user?.first_name ? user?.first_name + " " : "") + user?.last_name
    address = user?.address
  } else {
    // ChallengeMemberType.Team
    const team = p.userScore.userInfo as ActivityGroup | undefined
    image = team?.image
    name = team?.group_title ?? "Tēm"
    address = undefined
  }

  let metricValue: JSX.Element
  let multipleMetricValue: JSX.Element | undefined = undefined

  if (metric instanceof Array) {
    // multiple values
    metricValue = (
      <Pressable
        style={[styles.score, styles.expandableScore]}
        onPress={() => setExpanded(!expanded)}
      >
        <Icon name={expanded ? "chevron-up" : "chevron-down"} size={14} />
      </Pressable>
    )
    if (expanded) {
      // TODO: animate height
      multipleMetricValue = (
        <View style={styles.userChallengeScore}>
          <HexagonChallengeMetricsViewer metric={metric} score={userScore} />
        </View>
      )
    }
  } else {
    // single value
    metricValue = (
      <Text style={[styles.score, styles.scoreValue]}>
        {getMetricValueStringFromScore(metric, userScore)}
      </Text>
    )
  }

  return (
    <>
      <Pressable style={styles.row}>
        <View style={styles.mainView}>
          <View style={styles.mainView2}>
            <View style={[styles.rank, styles.hex]}>
              <View style={styles.hexagon}>
                <View style={styles.hexagonInner}>
                  <Text style={styles.hexagonText}>
                    {userScore.rank.toString()}
                  </Text>
                </View>
                <View style={styles.hexagonBefore} />
                <View style={styles.hexagonAfter} />
              </View>
            </View>
            <View style={styles.temate}>
              <Avatar
                source={image}
                size={UserAvatarSize}
                style={styles.userAvatar}
              />

              <View style={styles.temateInfo}>
                <View>
                  <Text style={styles.userName} numberOfLines={1}>
                    {name}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.hexagon1}>
              <View style={styles.hexagonInner1}>
                <Text style={styles.hexagonText1}>{scoreString}</Text>
              </View>
              <View style={styles.hexagonBefore1} />
              <View style={styles.hexagonAfter1} />
            </View>
          </View>
        </View>
      </Pressable>
    </>
    // <View style={styles.rowWrapper}>
    //   <View style={styles.row}>
    //     <View style={[styles.rank, styles.hex]}>
    //       <Hexagon
    //         columns={1}
    //         rows={1}
    //         textColor={MainBlueColor}
    //         stroke={MainBlueColor}
    //         strokeWidth={1}
    //         contentImageWidth={30}
    //         cells={[
    //           { fitStroke: true, content: { h2: userScore.rank.toString() } },
    //         ]}
    //       />
    //     </View>
    //     <View style={styles.temate}>
    //       <Avatar
    //         source={image}
    //         size={UserAvatarSize}
    //         style={styles.userAvatar}
    //       />
    //       <View style={styles.temateInfo}>
    //         <Text style={styles.userName} numberOfLines={1}>
    //           {name}
    //         </Text>
    //         {address && (address.city || address.country) ? (
    //           <View style={styles.location}>
    //             <Icon
    //               name="map-marker-alt"
    //               size={12}
    //               style={styles.locationIcon}
    //             ></Icon>
    //             <Text>
    //               {address.city ? address.city : null}
    //               {address.city && address.country ? ", " : null}
    //               {address.country ? address.country : null}
    //             </Text>
    //           </View>
    //         ) : null}
    //       </View>
    //     </View>
    //     {score}
    //     {metricValue}
    //   </View>
    //   {multipleMetricValue}
    // </View>
  )
}

export function Details(p: {
  model: GoalChallengeDetailsModel
  percentOverride?: number
}): JSX.Element | null {
  const model = p.model
  const gncType = model.gncType

  return reactive(() => {
    const status: ActivityStatus = model?.status
    const scorePercent: number =
      p.percentOverride ?? model?.scorePercentage ?? 0
    const target: GoalTarget =
      model?.target !== undefined && model?.target.length
        ? model.target[0]
        : EmptyGoalTarget
    const typeLogoSource: ImageSourcePropType =
      p.model?.anyActivity || p.model?.activityTypes.length > 1
        ? ActivityImage
        : { uri: p.model.activityTypes[0]?.logo ?? "" }

    let info: JSX.Element
    // TODO: call global App "timer" state
    if (gncType === ActivityType.Goal && status === ActivityStatus.Completed) {
      const text = scorePercent < 100 ? "Goal Incomplete" : "Goal Complete"
      info = <Text style={styles.pastGoalCompletionStatus}>{text}</Text>
    } else {
      const now: number = Date.now()
      const timeInfo: string = getGoalChallengeTimeInfo(
        model.startDate,
        model.endDate,
        status,
        now
      )
      info = <Text style={styles.timeInfo}>{timeInfo}</Text>
    }
    if (gncType === ActivityType.Challenge) {
      const challengePeriod: string = `${formatDate(
        new Date(model.startDate)
      )} to ${formatDate(new Date(model.endDate))}`
      info = (
        <>
          <Text style={styles.challengePeriodInfo}>{challengePeriod}</Text>
          {info}
        </>
      )
    }
    let perPersonGoalInfo: JSX.Element | null = null
    if (gncType === ActivityType.Goal && model.isPerPersonGoal) {
      perPersonGoalInfo = (
        <Text>
          {getMetricValueString(target.matric, target.value)}
          {getMetricMeasureText(target.matric)} per person
        </Text>
      )
    }

    const now: number = Date.now()
    const timeInfo: string = getGoalChallengeTimeInfo(
      model.startDate,
      model.endDate,
      status,
      now
    )
    return (
      <View style={styles.cardHead}>
        <View style={styles.cardHeadTop}>
          <View style={{}}>
            <View style={{ marginTop: 10, right: 5 }}>
              <View style={{ right: 20 }}>
                {/* <Text style={{ fontSize: 16 }}>{model.name}</Text> */}
                {/* <Text >{model.getTypeName()}</Text> */}
                <Text style={styles.activity}>
                  {getMetricName(target.matric)}
                </Text>
                <Text style={{ fontSize: 12, left: 115 }}>Core</Text>
                <Text style={{ fontSize: 12, left: 100 }}>Running</Text>
              </View>
              <View style={{ marginTop: 30 }}>
                <Text style={styles.activity}>Metrics</Text>
                <Text style={{ fontSize: 12, left: 45 }}>
                  {/* Total Activities */}
                  {model.membersScore[0].totalActivites}
                </Text>
                <Text style={{ fontSize: 12, left: 45 }}>
                  {/* Max Calories */}
                  {model.membersScore[0].calories}
                </Text>
                <Text style={{ fontSize: 12, left: 45 }}>
                  {/* Total Distance */}
                  {model.membersScore[0].distanceCovered}
                </Text>
              </View>
            </View>
            <View >
              <Text style={styles.dayCountLeft}>
                {timeInfo.slice(0, 6)}LEFT
              </Text>
            </View>
          </View>
          {/* <Image source={typeLogoSource} tintColor={MainBlueColor} style={{ width: 30, height: 30, resizeMode: 'contain' }} /> */}
        </View>
        {/* <Text style={{ marginTop: 5 }}>{model.memberCount} tēmate{model.memberCount === 1 ? '' : 's'}</Text>
        {perPersonGoalInfo}
        {info} */}
      </View>
    )
  })
}
export function GoallDetails(p: {
  model: GoalChallengeDetailsModel
  percentOverride?: number
}): JSX.Element | null {
  // const model = p.model;
  // const gncType = model.gncType;
  const model = App.goalsAndChallenges.currentGoalChallenge
  const windowHeight = Dimensions.get("window").height
  const windowWidth = Dimensions.get("window").width
  // console.log("model>>>>>>",JSON.stringify(model,null,2))
  console.log("challengeModel--->>>>", JSON.stringify(model,null,2))
  const isJoined = model?.isJoined

  const status: ActivityStatus = model?.status
  const now: number = Date.now()
  const timeInfo: string = getGoalChallengeTimeInfo(
    model?.listItem?.startDate,
    model?.listItem?.endDate,
    status,
    now
  )
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
  ]
  const startDateStamp = new Date(model?.listItem?.startDate)
  const startDate =
    monthNames[startDateStamp.getMonth()] +
    " " +
    startDateStamp.getDate() +
    "," +
    startDateStamp.getFullYear()

  const endDateStamp = new Date(model?.listItem?.endDate)
  const endDate =
    monthNames[endDateStamp.getMonth()] +
    " " +
    endDateStamp.getDate() +
    "," +
    endDateStamp.getFullYear()

  const scorePercent: number = model?.scorePercentage ?? 0
  const goalStatusText: string =
    status === ActivityStatus.Completed
      ? scorePercent < 100
        ? "Goal Incomplete"
        : "Goal Complete"
      : `${scorePercent.toFixed(0)}%`

  return reactive(() => {
    // const status: ActivityStatus = model.status;
    // const scorePercent: number =
    //   p.percentOverride ?? model.scorePercentage ?? 0;
    // const target: GoalTarget =
    //   model.target !== undefined && model.target.length
    //     ? model.target[0]
    //     : EmptyGoalTarget;
    // const typeLogoSource: ImageSourcePropType =
    //   p.model.anyActivity || p.model.activityTypes.length > 1
    //     ? ActivityImage
    //     : { uri: p.model.activityTypes[0]?.logo ?? "" };

    // let info: JSX.Element;
    // TODO: call global App "timer" state
    // if (gncType === ActivityType.Goal && status === ActivityStatus.Completed) {
    //   const text = scorePercent < 100 ? "Goal Incomplete" : "Goal Complete";
    //   info = <Text style={styles.pastGoalCompletionStatus}>{text}</Text>;
    // } else {
    //   const now: number = Date.now();
    //   const timeInfo: string = getGoalChallengeTimeInfo(
    //     model.startDate,
    //     model.endDate,
    //     status,
    //     now
    //   );
    //   info = <Text style={styles.timeInfo}>{timeInfo}</Text>;
    // }
    // if (gncType === ActivityType.Challenge) {
    //   const challengePeriod: string = `${formatDate(
    //     new Date(model.startDate)
    //   )} to ${formatDate(new Date(model.endDate))}`;
    //   info = (
    //     <>
    //       <Text style={styles.challengePeriodInfo}>{challengePeriod}</Text>
    //       {info}
    //     </>
    //   );
    // }
    // let perPersonGoalInfo: JSX.Element | null = null;
    // if (gncType === ActivityType.Goal && model.isPerPersonGoal) {
    //   perPersonGoalInfo = (
    //     <Text>
    //       {getMetricValueString(target.matric, target.value)}
    //       {getMetricMeasureText(target.matric)} per person
    //     </Text>
    //   );
    // }
    return (
      //activie scree and fundrising
      <>
        <ScrollView>
          <View style={{ justifyContent: "center", height: (windowHeight / 100) * 38, alignItems: "center" }}>
            <View style={styles.activeView}>
              <View style={styles.cardHeadTop}>
                <View style={styles.imageContainer}>
                  <View>
                    <Image
                      source={
                        Polygon
                        // createGroup.imageUri
                        //   ? { uri: createGroup.imageUri }
                        //   :
                      }
                      style={styles.imageRound}
                    />
                  </View>
                </View>
                <View style={{}}>
                  <View style={{ marginTop: 10 }}>
                    <View style={{ position: "absolute", top: 15 }}>
                      {/* <Text style={{ fontSize: 16 }}>{model.name}</Text> */}
                      {/* <Text >{model.getTypeName()}</Text> */}
                      <Text style={styles.activity}>
                        {/* {getMetricName(target.matric)} */}
                      </Text>
                      {/* {App.user.isActivity &&
                    <>
                      <View style={styles.isActivity_fundrising}>
                        <Text style={styles.isActivity_fundrising_Text}>{goalStatusText}</Text>
                        <Text style={styles.isActivity_fundrising_Text2}>93.96 Miles</Text>
                      </View>
                    </>
                  }
                  {App.user.isFundrising && ( */}
                      {/* <> */}
                      <View
                      // style={styles.isActivity_fundrising}
                      style={{paddingLeft:"20%"}}
                      >
                        <Text style={styles.isActivity}>
                          {model?.listItem?.name}
                        </Text>
                        <Text style={styles.isActivity}>
                          {" "}
                          TĒMates | {model?.memberCount}
                        </Text>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              void App.goalsAndChallenges.openDonationPage(
                                model
                              )
                            }}
                            style={styles.donateAct}
                          >
                            <Text style={{ color: "#f7f7f7" }}>DONATE</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {/* </> */}
                      {/* )} */}
                    </View>
                  </View>
                  <View
                    style={{ position: 'relative' }}
                  >
                    <Text style={styles.dayCount}>
                      {timeInfo.slice(0, 6)} LEFT
                    </Text>
                  </View>
                </View>
                {/* <Image source={typeLogoSource} tintColor={MainBlueColor} style={{ width: 30, height: 30, resizeMode: 'contain' }} /> */}
              </View>
              {/* <Text style={{ marginTop: 5 }}>{model.memberCount} tēmate{model.memberCount === 1 ? '' : 's'}</Text>
        {perPersonGoalInfo}
        {info} */}
            </View>
          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={styles.detailTabGoal}>
              <Text style={styles.tabTextAct}> {goalStatusText} </Text>
              <Text style={styles.tabAct}>
                {/* $65.00 */}
                ${model?.fundraising?.goalAmount}
                </Text>
            </View>
          </View>

          <View style={{
            justifyContent: "center", alignItems: "center",
          }}>
            <View style={styles.detailTabActNew}>
              <Text style={styles.DiffText}>DETAILS</Text>
              <Text style={styles.sameText}>GOAL: 108 Miles</Text>
              <Text style={styles.sameText}>
                FUNDRISING GOAL : ${model?.fundraising?.collectedAmount} of ${model?.fundraising?.goalAmount}
              </Text>
              <Text style={styles.sameText}>
                METRIC: Any :{model?.miles}
              </Text>
              <Text style={styles.sameText}>
                DURATION: {startDate} - {endDate}
              </Text>
            </View>
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
                  shadowRadius: 1,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 4, height: 4 },
                  elevation: 7,
                  backgroundColor: "#f7f7f7",
                  marginHorizontal: 25,
                  // justifyContent: "center",
                  // alignItems: "center",
                  width: (windowWidth / 100) * 90,
                  height: (windowHeight / 100) * 25,
                  marginBottom: 30,
                }}
              >
                <Chatter model={model} />
              </Neomorph>
            </>
          )}
        </ScrollView>
      </>
    )
  })
}

const LeaderAvatarSize = 50
const LeaderResultSize = 30
const LeaderAvatarBorderWidth = 3
const UserAvatarSize = 40
const windowHeight = Dimensions.get("window").height
const windowWidth = Dimensions.get("window").width
export const styles = StyleSheet.create({
  // used in ChallengeDetails
  screen: {
    height: "100%",
    backgroundColor: "#fff",
  },
  scrollable: {
    height: "100%",
  },
  container: {
    width: "100%",
  },
  progressBlock: {
    backgroundColor: "#F5F5F5",
  },
  card1: {
    marginHorizontal: 10,
    marginVertical: 5,
    // borderWidth: 1,
    backgroundColor: "#fff",
    // borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    // borderWidth: 1,
    // backgroundColor: "red",
    // borderRadius: 10,
    padding: 10,
  },
  cards: {
    backgroundColor: "green",
  },
  lastCard: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  cardHead: {
    width: "100%",
  },
  chatter: {
    fontWeight: "500",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    marginLeft: 30,
    marginVertical: 10,
    textTransform: "uppercase",
    fontSize: 16,
  },
  cardHeadTop: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  pastGoalCompletionStatus: {
    backgroundColor: LightBlueColor,
    color: "white",
    marginVertical: 5,
    paddingVertical: 7,
    paddingHorizontal: 5,
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  challengePeriodInfo: {
    marginVertical: 5,
    color: "black",
  },
  timeInfo: {
    marginVertical: 5,
    color: MainBlueColor,
  },
  joinButton: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginVertical: 10,
    borderRadius: 40,
    alignSelf: "center",
  },

  table: {},
  columnHeader: {
    textTransform: "lowercase",
  },

  rowWrapper: {},
  row: {
    paddingVertical: 10,
    marginHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
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
    width: 60,
    textAlign: "right",
    textAlignVertical: "center",
  },
  expandableScore: {
    alignItems: "center",
    justifyContent: "center",
  },
  userChallengeScore: {
    padding: 20,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
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
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 5,
  },
  scoreValue: {
    color: MainBlueColor,
  },

  showMore: {
    paddingVertical: 5,
    alignItems: "center",
  },
  showMoreText: {
    color: "gray",
  },

  containerimg: {
    width: 91,
    height: 91,
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bottom: 15,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
    // borderRadius: 1000,
  },
  imageRound: {
    width: 110,
    height: 125,
    marginBottom: 10,
  },
  imageContainer: {
    overflow: "hidden",
    // marginRight: 30,
    justifyContent: "center",
    // alignItems: "center",
    // paddingTop:30
  },
  activity: {
    color: "#0B82DC",
    fontSize: 24,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    marginLeft: 45,
  },
  dayCount: {
    color: "#0B82DC",
    fontSize:44,
    fontWeight: "800",
    paddingLeft:"10%",
    // textTransform: "uppercase",
    // transform: [{ rotate: "270deg" }],
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    letterSpacing: -1,
  },
  tabTextAct: {
    color: "#0B82DC",
    fontSize: 40,
    fontWeight: "500",
  },
  tabAct: {
    color: "#0B82DC",
    fontSize: 12,
    paddingLeft: 10,
  },
  dayCountLeft: {
    color: "#0B82DC",
    fontSize: 44,
    fontWeight: "800",
    textTransform: "uppercase",
    transform: [{ rotate: "270deg" }],
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    letterSpacing: -1,
    marginTop: -100,
    marginLeft: 65,
  },
  detailTab: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: GrayColor,
    marginHorizontal: 30,
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
  tabText: {
    color: "#707070",
    textTransform: "uppercase",
    fontSize: 12,
  },
  loginButton: {
    // minWidth: 128,
    width: "30%",
    backgroundColor: "#03F6F0",
    borderRadius: 10.5,
    marginTop: 20,
  },
  donate: {
    backgroundColor: "#03F6F0",
    left: 0,
    width: 80,
    top: 15,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  donateAct: {
    backgroundColor: "#03F6F0",
    left: -4,
    width: 120,
    top: 15,
    // height: 34,
    padding:5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.29,
    shadowRadius: 5.65,
    elevation: 7,
  },
  mainView: {
    backgroundColor: "#F7F7F7",
    width: "100%",
    height: 70,
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
    color: "#707070",
    flex: 1,
    textAlignVertical: "center",
    textAlign: "left",
    marginLeft: 5,
    fontSize: 12,
    // marginTop: 5,
  },
  rankText: {
    fontWeight: "500",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    top: 12,
    left: 20,
    fontSize: 16,
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
    marginTop: 10,
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
  },
  userStyle: {
    backgroundColor: "#C117D9",
    width: 20,
    height: 20,
    left: 20,
    borderRadius: 10,
  },
  activeView: {
    width: (windowWidth / 100) * 80,
    height: (windowHeight / 100) * 30,
    paddingLeft: 10,
  },
  DetailsView: {
    backgroundColor: "#F7F7F7",
    width: "85%",
    height: (windowHeight / 100) * 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.29,
    shadowRadius: 5.65,
    elevation: 5,
    borderRadius: 8,
    marginBottom: 8,

  },
  detailsText: {
    color: "#0B82DC",
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    shadowColor: "#fff",
    marginLeft: 10,
    marginTop: 8,
  },
  detailsAlltext: {
    color: "gray",
    margin: 3,
    marginLeft: 10,
    fontSize: 12,
  },
  isActivity_fundrising: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },
  // isActivity_fundrising_Text:{
  //   fontSize: 40,
  //   color: '#0E83DB',
  //   fontWeight: '500',
  //   marginRight:45,
  //   letterSpacing:-1,
  // },
  isActivity: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 120,
    padding: 5,
    marginTop: 15,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: GrayColor,
    marginHorizontal: 20,
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
  isActivity_fundrising_Text2: {
    fontSize: 12,
    color: "#0E83DB",
  },
  detailTabGoal: {
    backgroundColor: "#f7f7f7",
    width: "85%",
    // height: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.29,
    shadowRadius: 5.65,
    elevation: 7,
    borderRadius: 8,
    marginBottom: 5,
  },
  detailTabActNew: {
    backgroundColor: "#f7f7f7",
    width: "85%",
    // height: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.29,
    shadowRadius: 5.65,
    elevation: 7,
    borderRadius: 8,
    marginBottom: 5,
    padding: 5,
  },
  sameText: {
    color: "#707070",
    paddingVertical: 2
  },
  DiffText: {
    color: "#0B82DC",
    fontWeight: "500",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    shadowColor: "#fff",
  }
})
