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
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import {
  CalendarDisplayMode,
  CalendarManager,
  WeekDayNames,
  eventIconMap,
} from "models/app/Calendar/CalendarManager";
import { EventInfo, EventType } from "models/data/EventInfo";
import { DateKind } from "models/app/Calendar/DayInfo";
import { doAsync } from "common/doAsync";
import InsetShadow from "react-native-inset-shadow";
import { WheelPickerBadge } from "components/WheelPickerBadge";
import Icon from "react-native-vector-icons/FontAwesome5";
import { eventList, openEditEvent } from "./Events";
import { standalone, Transaction } from "reactronic";
import { EventEditor } from "models/app/Calendar/EventEditor";
import { EventDetailsModel } from "models/app/Calendar/EventDetailsModel";
import { loadAndShowEventDetails } from "screens/calendar/Events";
import { MonthList } from "./MonthList";
import { addEventListener } from "react-native-localize";
import { useNavigation } from "@react-navigation/native";
import { App } from "models/app/App";

export interface DayGridProps {
  manager: CalendarManager;
  eventDetails: any;
}
export function DayGrid(p: DayGridProps): JSX.Element {
  React.useEffect((event?: EventDetailsModel) => {
    const editor = standalone(() =>
      Transaction.run(() => new EventEditor(event))
    );
    eventList(editor.event);
  }, []);
  const navigation = useNavigation();
  return reactive(() => {
    const manager = p.manager;
    const days = manager.getCurrentMonthDays();
    const suffix = `${manager.current.month}_${manager.current.year}`;

    return (
      <>
        <SafeAreaView style={styles.container}>
          <GestureRecognizer
            style={styles.container1}
            onSwipeRight={() => manager.showPreviousMonth()}
            onSwipeLeft={() => manager.showNextMonth()}
          >
            <InsetShadow
              shadowColor="#fff"
              shadowRadius={10}
              elevation={10}
              shadowOffset={3}
              shadowOpacity={0.9}
              containerStyle={{ borderRadius: 5 }}
            >
              <View style={styles.line}>
                {WeekDayNames.map((day) => (
                  <View key={`Weekday_${day}`} style={styles.day}>
                    <Text style={[styles.text, styles.dayText]}>{day}</Text>
                  </View>
                ))}
              </View>
              {days &&
                days.map((week, i) => (
                  <View
                    key={`Week_${i}_${suffix}`}
                    style={[styles.line, styles.week]}
                  >
                    {week.map((day, j) => {
                      const schedule = day.schedule;
                      const hasEvents =
                        schedule.hasEventsOfType(EventType.Regular) ||
                        schedule.hasEventsOfType(EventType.SignupSheet);
                      const hasGoals = schedule.hasEventsOfType(EventType.Goal);

                      const hasChallenges = schedule.hasEventsOfType(
                        EventType.Challenge
                      );
                      return (
                        <Pressable
                          key={day.date.toString()}
                          style={[
                            styles.date,
                            j === 6 ? styles.last : undefined,
                          ]}
                          onPress={() => {
                            doAsync(() => 
                              p.manager.setDisplayMode(
                                CalendarDisplayMode.List,day.date,                                
                              )
                            )
                            Transaction.run(() => {
                              App.user.day = day.date
                            })
                          }
                          }
                        >
                          <Text
                            style={[
                              styles.text,
                              day.otherMonth ? styles.otherMonth : undefined,
                              day.kind === DateKind.Now
                                ? styles.current
                                : undefined,
                            ]}
                          >
                            {day.date.getDate()}
                          </Text>
                          {hasEvents && (
                            <Pressable style={styles.icon}>
                              <Image
                                source={eventIconMap.get(EventType.Regular)!}
                              />
                            </Pressable>
                          )}
                          {hasGoals && (
                            <Pressable style={styles.icon}>
                              <Image
                                source={eventIconMap.get(EventType.Goal)!}
                              />
                            </Pressable>
                          )}
                          {hasChallenges && (
                            <Pressable style={styles.icon}>
                              <Image
                                source={eventIconMap.get(EventType.Challenge)!}
                              />
                            </Pressable>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
            </InsetShadow>
          </GestureRecognizer>
          <View style={styles.currentRow}>
            <WheelPickerBadge manager={manager.dateManager} />
            <TouchableOpacity
              style={styles.action}
              onPress={() => openEditEvent()}
            >
              <Icon name="plus" style={{ fontSize: 15, color: "#fff" }} />
            </TouchableOpacity>
          </View>
          <MonthList manager={manager} />
        </SafeAreaView>
      </>
    );
  });
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    backgroundColor: "#2e2e2e",
    alignItems: "center",
    height: "100%",
  },
  container1: {
    width: "80%",
    backgroundColor: "#3e3e3e",
    borderRadius: 15,
    height: "50%",
    marginTop: 10,
    borderColor: "red",
    shadowColor: "red",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
  },
  day: {
    paddingVertical: 10,
    flex: 1,
  },
  dayText: {
    fontWeight: "bold",
    color: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 5,
  },
  week: {
    flex: 1,
  },
  date: {
    flex: 1,
    height: "100%",
    alignItems: "flex-start",
    // borderColor: 'lightgray',
    // borderRightWidth: 1,
    // borderBottomWidth: 1,
  },
  last: {
    borderRightWidth: 0,
  },
  text: {
    width: "100%",
    textAlign: "center",
    color: "#0B82DC",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 5,
  },
  otherMonth: {
    color: "lightgray",
  },
  icon: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  current: {
    color: "#B620E0",
  },
  currentRow: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  action: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e2e2e",
    margin: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "white",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
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

export function EventList(p: DayGridProps) {
  const eventDetails = [
    {
      number: "6",
      event: "Push Up & Core Challenge (Day 2/32)",
      days: "1:17 PM - 1:37 PM",
      detail: "Details...",
    },
    {
      number: "7",
      event: "Push Up & Core Challenge (Day 2/32)",
      days: "1:17 PM - 1:37 PM",
      detail: "Details...",
    },
    {
      number: "9",
      event: "Push Up & Core Challenge (Day 2/32)",
      days: "1:17 PM - 1:37 PM",
      detail: "Details...",
    },
    {
      number: "9",
      event: "Push Up & Core Challenge (Day 2/32)",
      days: "1:17 PM - 1:37 PM",
      detail: "Details...",
    },
  ];
  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 80,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {p.eventDetails.map((items) => (
        <View style={styles.main_hexagon}>
          <View style={styles.main2_hexagon}>
            <View style={{ width: "18%" }}>
              <View style={styles.hexagon}>
                <View style={styles.hexagonInner}>
                  <Text style={{ color: "#fff" }}>{items.eventType}</Text>
                </View>
                <View style={styles.hexagonBefore} />
                <View style={styles.hexagonAfter} />
              </View>
            </View>

            <View style={{ width: "67%", marginTop: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: "500", color: "#fff" }}>
                {items.title}
              </Text>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text
                  style={{ fontSize: 12, fontWeight: "500", color: "#fff" }}
                >
                  {items.startDate.slice(11, 19)}-
                </Text>
                <Text
                  style={{ fontSize: 12, fontWeight: "500", color: "#fff" }}
                >
                  {items.endDate.slice(11, 19)}
                </Text>
              </View>
            </View>
            <View style={{ width: "50%", marginTop: 55 }}>
              <TouchableOpacity
                onPress={async (event: EventInfo) => {
                  try {
                    void loadAndShowEventDetails(items._id);
                  } catch (e) {}
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
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
