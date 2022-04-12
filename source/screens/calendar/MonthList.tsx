//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { reactive } from "common/reactive";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  LayoutRectangle,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

import EventImageLight from "assets/icons/act/act.png";
import TaskStrokeImage from "assets/icons/TaskStroke/TaskStroke.png";
import GoalImageLight from "assets/icons/achievement/achievement.png";
import ChallengeImageLight from "assets/icons/challenge/challenge.png";


import {
  CalendarManager,
  MonthDays,
} from "models/app/Calendar/CalendarManager";
import { doAsync } from "common/doAsync";
import { MainBlueColor } from "components/Theme";
import { EventType } from "models/data/EventInfo";
import { App } from "models/app/App";
import { loadAndShowEventDetails } from "./Events";
import { AcceptanceStatus } from "models/app/Calendar/EventMember";
import Hexagone from "assets/hexagon.png"

export interface MonthListParams {
  manager: CalendarManager;
}

export function MonthList(p: MonthListParams): JSX.Element {
  const listViewRef: React.Ref<FlatList> = React.useRef(null);
   return reactive(() => {
    return (
      <SafeAreaView style={styles.container}>
        {!p.manager.months.length > 0 ? <ActivityIndicator color="#04FCF6" size={50}/> :
        <FlatList
          ref={listViewRef}
          data={p.manager.months}
          contentContainerStyle={{paddingBottom:70}}
          keyExtractor={(month) => {
            const info = p.manager.getMonthInfo(month);
            const prefix = Date.now();
            return prefix + "-" + p.manager.getMonthTitle(info);
          }}
          initialNumToRender={1}
          renderItem={(month) => (
            <View>
              <MonthItem manager={p.manager} days={month.item} />
            </View>
          )}
          // onEndReached={() => doAsync(async () => p.manager.loadNextMonths())}
          // onEndReachedThreshold={0.1}
        />
          }
      </SafeAreaView>
    );
  });
}

interface MonthItemParams {
  days: MonthDays;
  manager: CalendarManager;
}

function MonthItem(p: MonthItemParams): JSX.Element {
  return reactive(() => {
    const info = p.manager.getMonthInfo(p.days);
    const suffix = `${info.month}_${info.year}`;
    return (
      <SafeAreaView style={styles.month}>
        {p.days.map((week, i) => {
          const eventDays = p.manager.getEventDays(week);
          return (
            <View key={`Week_${i}_${suffix}`} style={styles.week}>
              {eventDays.length > 0 && (
                <View>
                  {eventDays.filter((i:any) => {
                    let d1 = new Date(i.date);
                    let d2 = App.user.day ? new Date(App.user.day) : new Date();
                    return d1.getFullYear() === d2.getFullYear() && d1.getMonth()=== d2.getMonth() && d1.getDate() === d2.getDate();
            
          }).map((day) => {
                    const suffix = day.date.toString();
                    return (
                      <>
                        <View key={`Day_${suffix}`} style={styles.day}>
                          <View style={styles.events}>
                            {day.schedule.events.map((event, i) => {
                              const status = day.getAcceptanceStatus(event);
                              const accepted =
                                status === AcceptanceStatus.Accepted;
                              const declined =
                                status === AcceptanceStatus.Declined;
                              const name = event.getName();
                              return (
                                <Pressable
                                  key={`Event_${i}_${name}_${suffix}`}
                                  style={[
                                    styles.event,
                                    accepted ? styles.accepted : undefined,
                                  ]}
                                  onPress={() => {
                                    switch (event.eventType) {
                                      case EventType.Goal:
                                        void App.goalsAndChallenges.openGoalDetails(
                                          event._id!,
                                          null
                                        );
                                        break;
                                      case EventType.Challenge:
                                        void App.goalsAndChallenges.openChallengeDetails(
                                          event._id!,
                                          null
                                        );
                                        break;
                                      case EventType.Regular:
                                      case EventType.SignupSheet:
                                        void loadAndShowEventDetails(
                                          event._id!
                                        );
                                        break;
                                    }
                                  }}
                                >
                                  <ImageBackground
                                    source={Hexagone}
                                    style={styles.background}
                                  >
                                    <Text style={styles.dateText}>
                                      {day.date.getDate()}
                                    </Text>
                                  </ImageBackground>
                                  <View style={styles.description}>
                                    <Text
                                      style={[
                                        styles.name,
                                        accepted
                                          ? styles.acceptedText
                                          : undefined,
                                        declined ? styles.declined : undefined,
                                      ]}
                                    >
                                      {day.getEventName(event)}
                                    </Text>
                                    <Text
                                      style={[
                                        accepted
                                          ? styles.acceptedText
                                          : undefined,
                                        declined ? styles.declined : undefined,
                                      ]}
                                    >
                                      {day.getEventTime(event)}
                                    </Text>
                                    <View
                                      style={{
                                        justifyContent: "flex-end",
                                        alignItems: "flex-end",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 10,
                                          color: "#0B82DC",
                                          fontWeight: "500",
                                        }}
                                      >
                                        Details...
                                      </Text>
                                    </View>
                                  </View>
                                </Pressable>
                              );
                            })}
                          </View>
                        </View>
                      </>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </SafeAreaView>
    );
  });
}

const eventIconLightMap: Map<EventType, number> = new Map<EventType, number>([
  [EventType.Regular, EventImageLight],
  [EventType.SignupSheet, TaskStrokeImage],
  [EventType.Goal, GoalImageLight],
  [EventType.Challenge, ChallengeImageLight],
]);

const VerticalPadding = 15;
const EventPadding = 60;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: '100%',
    flex: 1,
    paddingTop: VerticalPadding,
    backgroundColor: "#2e2e2e",
  },
  month: {
    width: "100%",
    height: '100%',
    paddingTop: VerticalPadding,
    backgroundColor: "#2e2e2e",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    paddingBottom: VerticalPadding,
    borderColor: MainBlueColor,
    borderTopWidth: 1,
  },
  headerText: {
    textTransform: "uppercase",
    marginTop: -10,
    paddingLeft: VerticalPadding,
    backgroundColor: "white",
  },
  headerBullet: {
    color: MainBlueColor,
    paddingRight: VerticalPadding,
  },
  week: {
    width: "100%",
  },
  weekHeader: {
    flexDirection: "row",
    paddingLeft: EventPadding,
    paddingBottom: VerticalPadding,
    alignItems: "center",
  },
  day: {
    width: "100%",
    flexDirection: "row",
  },
  date: {
    width: EventPadding,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  background: {
    // resizeMode: "stretch",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    width: 35,
    height: 40,
    margin: 10,    
  },
  dateText: {
    color: "#fff",
    fontSize: 15,
  },
  border: {
    flex: 1,
    borderColor: "lightgray",
    borderLeftWidth: 1,
    marginLeft: "50%",
  },
  weekDay: {
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
  },
  events: {
    // height: 75,
    width: "100%",
    flex: 1,
    backgroundColor: "#2e2e2e",
    justifyContent: "center",
    alignItems: "center",
    // paddingRight: 20,
  },
  event: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    backgroundColor: "#2e2e2e",
    marginBottom: VerticalPadding,
    height: 75,
    width: '75%',
  },
  description: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
  },
  icon: {
    paddingLeft: 10,
  },
  accepted: {
    backgroundColor: "#2e2e2e",
    borderRadius: 10,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 75,
    width: "75%",
  },
  acceptedText: {
    color: "white",
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  declined: {
    textDecorationLine: "line-through",
  },
  hexagon: {
    width: 100,
    height: 25,
    marginTop: 27,
    marginHorizontal: 10,
  },
  hexagonInner: {
    width: 36,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B82DC",
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
    borderTopColor: "#0B82DC",
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
    borderBottomColor: "#0B82DC",
  },
  main_hexagon: {
    backgroundColor: "#3E3E3E",
    height: 75,
    width: "75%",

    marginTop: 15,
    borderRadius: 10,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  main2_hexagon: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
});
