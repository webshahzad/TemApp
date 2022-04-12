//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { reactive } from "common/reactive";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import Icons from "react-native-vector-icons/Feather";
import MIcons from "react-native-vector-icons/MaterialIcons";
import TaskStrokeImage from "assets/icons/TaskStroke/TaskStroke.png";
import { Neomorph } from "react-native-neomorph-shadows";
import { RootStackPropsPerPath } from "navigation/params";
import {
  EventDetailsModel,
  EventScope,
} from "models/app/Calendar/EventDetailsModel";
import {
  EventRecurrence,
  EventType,
  EventVisibility,
  getEventVisibilityText,
} from "models/data/EventInfo";
import { App } from "models/app/App";
import { GrayColor, MainBlueColor } from "components/Theme";
import { Image } from "react-native";
import { doAsync } from "common/doAsync";
import { openEditEvent } from "./Events";
import { ScrollView } from "react-native-gesture-handler";
import arrow from "assets/images/arrow.png";
import CheckBoxComp from "components/CheckBoxComp";
import { InputBadge } from "components/InputBadge";
import { Ref } from "reactronic";
import { useNavigation } from "@react-navigation/native";
import { RoundButton } from "components/RoundButton";
import { AcceptanceStatus } from "models/app/Calendar/EventMember";

export interface EventDetailsProps {
  model: EventDetailsModel;
}

export function EventDetails(
  p: StackScreenProps<RootStackPropsPerPath, "EventDetails">
): JSX.Element {
  const deleteEvent = async (scope: EventScope): Promise<void> => {
    await p.route.params.model.deleteEvent(scope);
    App.rootNavigation.pop();
  };
  const navigation = useNavigation();
  const deleteActions = [
    {
      name: "Delete This Event Only",
      onPress: () => doAsync(() => deleteEvent(EventScope.ThisOnly)),
    },
    {
      name: "Delete All Future Events",
      onPress: () => doAsync(() => deleteEvent(EventScope.AllFutureEvents)),
    },
  ];

  return reactive(() => {
    const model = p.route.params.model;
    const event = model.event;
    const u = Ref.to(App.user);
    const member = event.members;

    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var d = new Date(model?.getDateDescription());
    var dayName = days[d.getDay()];

    const status = model.getMyAcceptanceStatus();
    const isOwner = model.isEventOwner();
    const isPastEvent = model.isPastEvent();
    const isSignupEvent = event.eventType === EventType.SignupSheet;
    const hideRSVP: boolean = isSignupEvent && model.owner._id == App.user.id;
    const membersInfoText = isSignupEvent
      ? `${event.pendingCount} waiting to join`
      : `${event.acceptedCount} yes, ${event.pendingCount} pending, ${event.declinedCount} declined`;
    const showMembersInfoText: boolean = !isSignupEvent || event.totalCount > 0; // members capacity is not Infinite
    const joinTitle: string =
      isSignupEvent && event.isUserWaitingToJoin ? "Waiting to join" : "Join";
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.back}
            onPress={() => App.rootNavigation.pop()}
          >
            <Image source={arrow} />
          </Pressable>
          <View style={styles.title}>
            <Text style={styles.headerText}>THE TĒM APP</Text>
          </View>
          <TouchableOpacity style={styles.images} onPress={()=>navigation.navigate("ChatList")}>
            <Icons name="mail" style={styles.actionIcons} />
          </TouchableOpacity>
          {isOwner && (
            <TouchableOpacity
              style={styles.images}
              onPress={() =>
                Alert.alert("", "Are you sure you want to delete an event?", [
                  { text: "Cancel" },
                  {
                    text: "OK",
                    onPress: () =>
                      doAsync(async () => {
                        if (event.reccurEvent === EventRecurrence.Single) {
                          await deleteEvent(EventScope.AllFutureEvents);
                        } else {
                          App.actionModal.show(deleteActions);
                        }
                      }),
                  },
                ])
              }
            >
              <Icon
                name="trash-alt"
                style={[styles.actionIcon, styles.important]}
              />
            </TouchableOpacity>
          )}
          {isOwner && !isPastEvent && (
            <TouchableOpacity
              style={styles.images}
              onPress={() => openEditEvent(model)}
            >
              <MIcons name="edit" color="#f7f7f7" style={styles.actionIcon} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView>
          <View style={styles.content}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Neomorph
                inner // <- enable shadow inside of neomorph
                // swapShadows // <- change zIndex of each shadow color
                style={{
                  marginTop: 10,
                  shadowRadius: 5,
                  borderRadius: 12,
                  shadowColor: "#fff",
                  shadowOffset: { width: 4, height: 4 },
                  elevation: 2,
                  backgroundColor: "",
                  width: 410,
                  height: 210,
                }}
              >
                <View style={styles.section}>
                  <View style={styles.general}>
                    <View style={styles.info}>
                      <Text style={styles.sectionHeader}>{event.title}</Text>

                      <View style={[styles.infoRow, styles.line]}>
                        <Text style={{ color: "#fff" }}>
                          {dayName}
                          {model.getDateDescription()}
                        </Text>
                      </View>
                      <View style={[styles.infoRow, styles.line]}>
                        <Text style={{ color: "#fff" }}>
                          {model.getTimeDescription()}
                        </Text>
                      </View>
                      <View style={[styles.infoRow, styles.line]}>
                        <Text style={{ color: "#fff" }}>
                          {event.location?.location || "N/A"}
                        </Text>
                      </View>
                      <View style={[styles.infoRow, styles.line]}>
                        <Text style={{ color: "#fff" }}>
                          {model.owner.getFullName()}
                        </Text>
                      </View>
                      <View style={[styles.infoRow, styles.line]}>
                        <Text style={{ color: "#fff" }}>
                          Creator: {model.event.created_at}
                        </Text>
                      </View>
                      {event.eventType === EventType.SignupSheet && (
                        <View style={[styles.infoRow, styles.line]}>
                          <Image
                            source={TaskStrokeImage}
                            style={styles.infoIconImage}
                          />
                          <Text>Signup Sheet</Text>
                        </View>
                      )}
                      <View style={[styles.infoRow, styles.line]}>
                        <Text style={{ color: "#fff" }}>
                          {getEventVisibilityText(
                            event.visibility ?? EventVisibility.Private
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Neomorph>
            </View>
            <Text style={styles.sectionHeader}>Description</Text>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Neomorph
                inner // <- enable shadow inside of neomorph
                swapShadows // <- change zIndex of each shadow color
                style={{
                  shadowRadius: 5,
                  borderRadius: 12,
                  shadowColor: "#fff",
                  shadowOffset: { width: 4, height: 4 },
                  elevation: 2,
                  backgroundColor: "",
                  width: 350,
                  height: 160,
                }}
              >
                <View style={{ marginHorizontal: 20, marginTop: 8 }}>
                  <Text style={styles.light}>{event.description}</Text>

                  <TouchableOpacity>
                    <Text style={styles.moretext}>More...</Text>
                  </TouchableOpacity>
                </View>
              </Neomorph>
            </View>

            <Text style={styles.sectionHeader}>TĒMATES</Text>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Neomorph
                inner // <- enable shadow inside of neomorph
                swapShadows // <- change zIndex of each shadow color
                style={{
                  shadowRadius: 5,
                  borderRadius: 12,
                  shadowColor: "#fff",
                  shadowOffset: { width: 4, height: 4 },
                  elevation: 2,
                  backgroundColor: "",
                  width: 350,
                  height: 160,
                }}
              >
                <View style={styles.section}>
                  <View style={styles.temates}>
                    <FlatList
                      horizontal
                      data={model.members}
                      keyExtractor={(member) => member.userId}
                      renderItem={(member) => {
                        const user = member.item;
                        return (
                          <View style={styles.member}>
                            <View style={styles.profile}>
                              <Image
                                source={user.getAvatar()}
                                style={styles.avatar}
                              />
                            </View>
                            <Text style={[styles.light, { marginLeft: 5 }]}>
                              {user.first_name}
                            </Text>
                            <Text style={[styles.light, { marginLeft: 5 }]}>
                              {user.last_name}
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("MoreTemmates", {
                        users: model,
                      })
                    }
                  >
                    <Text style={styles.moretext2}>More...</Text>
                  </TouchableOpacity>
                </View>
              </Neomorph>
            </View>

            <View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View style={styles.inputContainer}>
                  <Text style={styles.boxText}>Sign up Sheet</Text>
                  <CheckBoxComp model={u.showSignup} />
                </View>
                {u.showSignup.value && (
                  <InputBadge
                    labelBackgroundColor="white"
                    style={{ width: "99%" }}
                  />
                )}
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View style={styles.inputContainer}>
                  <Text style={styles.boxText}>Checklist</Text>
                  <CheckBoxComp model={u.showChecklist} />
                </View>
                {u.showChecklist.value && (
                  <InputBadge
                    labelBackgroundColor="white"
                    style={{ width: "99%" }}
                  />
                )}
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View style={styles.inputContainer}>
                  <Text style={styles.boxText}>Reminder</Text>
                  <CheckBoxComp model={u.showReminder} />
                </View>
              </View>
            </View>

            {!hideRSVP && (
              <View style={styles.section}>
                <View
                  style={
                    (styles.infoRow,
                    { alignItems: "center", justifyContent: "center" })
                  }
                >
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      // flex: 1,
                      width: "30%",
                      height: 40,
                      borderRadius: 10,
                      borderColor: "#C900E6",
                      borderWidth: 1,
                      backgroundColor: "#2e2e2e",
                      shadowColor: "#fff",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                    onPress={() =>{
                      doAsync(() =>
                        model.setMyAcceptanceStatus(
                          AcceptanceStatus.Accepted
                        )
                        
                      )
                      navigation.navigate("Calendar")
                        }
                    }
                  >
                    <Text style={styles.join}>{joinTitle}</Text>
                  </TouchableOpacity>
                  {/* <View style={styles.buttons}>
                    {(!isSignupEvent || !event.isUserWaitingToJoin) && (
                      <RoundButton
                        label="YES"
                        color={
                          status === AcceptanceStatus.Accepted
                            ? "white"
                            : "black"
                        }
                        background={
                          status === AcceptanceStatus.Accepted
                            ? MainBlueColor
                            : GrayColor
                        }
                        style={styles.button}
                        onPress={() =>{
                          doAsync(() =>
                            model.setMyAcceptanceStatus(
                              AcceptanceStatus.Accepted
                            )
                            
                          )
                          navigation.navigate("Calendar")
                            }
                        }
                      />
                    )}
                    <RoundButton
                      label={
                        isSignupEvent && event.isUserWaitingToJoin
                          ? "Cancel"
                          : "NO"
                      }
                      color={
                        status === AcceptanceStatus.Declined ? "white" : "black"
                      }
                      background={
                        status === AcceptanceStatus.Declined
                          ? MainBlueColor
                          : GrayColor
                      }
                      style={styles.button}
                      onPress={() =>
                        doAsync(() =>
                          model.setMyAcceptanceStatus(AcceptanceStatus.Declined)
                        )
                      }
                    />
                  </View> */}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  });
}

const Padding = 10;
const Spacing = 10;
const UserAvatarSize = 40;
const StatusSize = 20;
const HeaderSize = 18;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2e2e2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "#2e2e2e",
  },
  back: {
    marginRight: 10,
  },
  title: {
    flex: 1,
  },
  headerText: {
    fontSize: HeaderSize,
    flex: 1,
    textAlign: "center",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
  },
  action: {
    marginLeft: 15,
  },
  actionIcon: {
    fontSize: HeaderSize,
  },
  important: {
    color: "red",
  },
  content: {
    flex: 1,
    backgroundColor: "#2e2e2e",
    padding: Padding,
  },
  section: {
    padding: Padding,
    marginBottom: Padding,
  },
  general: {
    flexDirection: "row",
  },
  info: {
    flex: 1,
    marginHorizontal: 20,
  },
  sectionHeader: {
    fontWeight: "bold",
    marginBottom: Spacing,
    textAlign: "left",
    fontSize: 16,
    marginHorizontal: 20,
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
    textTransform: "capitalize",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    color: "gray",
    marginRight: Spacing,
    width: 15,
    textAlign: "center",
  },
  infoIconImage: {
    marginRight: Spacing,
    width: 15,
    resizeMode: "contain",
  },

  line: {
    marginBottom: 2,
    marginLeft: 18,
  },
  picture: {
    width: 30,
    height: 30,
  },
  light: {
    color: "#fff",
  },
  temates: {
    marginVertical: Padding,
  },
  tematesHeader: {
    fontWeight: "bold",
  },
  member: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Padding,
    position: "relative",
  },
  avatar: {
    width: UserAvatarSize,
    height: UserAvatarSize,
    borderRadius: UserAvatarSize / 2,
  },
  status: {
    position: "absolute",
    right: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    width: StatusSize,
    height: StatusSize,
    borderRadius: StatusSize / 2,
  },
  statusIcon: {
    color: "white",
  },
  accepted: {
    backgroundColor: MainBlueColor,
  },
  declined: {
    backgroundColor: "red",
  },
  join: {
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop:20
  },
  button: {
    marginLeft: Spacing,
    minWidth: 60,
    borderWidth: 0,
  },
  images: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e2e2e",
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: "#fff",
    marginHorizontal: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profile: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e2e2e",
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  actionIcons: {
    color: "#fff",
    fontSize: 20,
  },
  inputContainer: {
    alignItems: "center",
    display: "flex",
    height: 35,
    marginVertical: 20,
    flexDirection: "row",
    borderRadius: 5,
    justifyContent: "space-between",
    width: "85%",
    backgroundColor: "#3e3e3e",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 12,
  },

  moretext: {
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
    textAlign: "right",
    marginTop: 100,
    fontSize: 10,
  },
  moretext2: {
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
    textAlign: "right",
    marginTop: 45,
    marginRight: 8,
    fontSize: 10,
  },
});
