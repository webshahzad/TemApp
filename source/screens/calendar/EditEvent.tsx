//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect, useState } from "react"
import { StackScreenProps } from "@react-navigation/stack"
import { reactive } from "common/reactive"
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native"
import { Ref, Transaction } from "reactronic"
import { Neomorph } from "react-native-neomorph-shadows"
import {
  EventEditor,
  EventRecurrenceNameMap,
} from "models/app/Calendar/EventEditor"
import { RootStackPropsPerPath } from "navigation/params"
import {
  AllEventTypesToCreate,
  AllEventVisibility,
  EventRecurrence,
  EventType,
  getEventTypeText,
  getEventVisibilityText,
  InfiniteEvent,
} from "models/data/EventInfo"
import { App } from "models/app/App"
import { DatePicker } from "components/DatePicker"

import { PickerBadge } from "components/PickerBadge"
import { doAsync } from "common/doAsync"
import { DangerColor, MainBlueColor } from "components/Theme"
import { EventScope } from "models/app/Calendar/EventDetailsModel"
import { PickerManager } from "models/app/PickerManager"
import { addEvent, eventList, loadAndShowEventDetails } from "./Events"
import arrow from "assets/images/arrow.png"
import Icon from "react-native-vector-icons/Ionicons"
import CheckBoxComp from "components/CheckBoxComp"
import CircularProgress from "components/CircularProgress"
import { InputBadgeDark } from "components/InputBadgeDark"
import { useNavigation } from "@react-navigation/native"

export interface EditEventProps {
  editor: EventEditor
}

export function EditEvent(
  p: StackScreenProps<RootStackPropsPerPath, "EditEvent">
): JSX.Element {
  useEffect(() => {
    const editor = p.route.params.editor
    p.navigation.setOptions({
      title: editor.isUpdating ? "Edit Event" : "Create Event",
    })
  }, [p.navigation])

  const saveChanges = async (scope: EventScope): Promise<void> => {
    await editor.saveChanges(scope)
    ToastAndroid.show(
      editor.isUpdating ? "Event updated" : "Event created",
      ToastAndroid.SHORT
    )
    if (editor.isUpdating) Alert.alert("2"), App.rootNavigation.pop()
    else void loadAndShowEventDetails(editor.event._id!, true)
  }

  const saveActions = [
    {
      name: "Update for this event only",
      onPress: () => doAsync(() => saveChanges(EventScope.ThisOnly)),
    },
    {
      name: "Update for this and following events",
      onPress: () => doAsync(() => saveChanges(EventScope.AllFutureEvents)),
    },
  ]

  const endsOnActions = [
    {
      name: "Never",
      onPress: () => p.route.params.editor.setInfiniteEvent(),
    },
    {
      name: "Select End Date",
      onPress: () => p.route.params.editor.selectEndsOnDate(),
    },
  ]

  const editor = p.route.params.editor

  const editorRef = Ref.to(editor)

  const e = Ref.to(editor.event)
  const u = Ref.to(App.user)

  const [visibilityManager] = useState(() =>
    Transaction.run(() => new PickerManager(AllEventVisibility, e.visibility))
  )
  const [typeManager] = useState(() =>
    Transaction.run(() => new PickerManager(AllEventTypesToCreate, e.eventType))
  )
  const navigation = useNavigation()




  return reactive(() => {
    const startDateEditor = editor.startDateEditor
    const endDateEditor = editor.endDateEditor
    const manager = App.addTemates

    const tematesToAdd = manager.tematesToAdd
    const endsOn = new Date(
      e.endsOn.value === InfiniteEvent ? editor.end : e.endsOn.value
    )
    const updating = editor.isUpdating

    // Validation
    const showInvalidTitle = editor.isInvalid && !editor.hasValidTitle
    const showInvalidDescription =
      editor.isInvalid && !editor.hasValidDescription
    const showInvalidEnd = !editor.isInvalid && editor.hasValidEnd
    const showInvalidCapacity =
      editor.isInvalid &&
      (!editor.hasValidCapacity || !editor.canAccommodateAllMembers)
    const invalidCapacityText = editor.getInvalidCapacityText()
    const temateTitle =
      editorRef.selectedGroup.owner.selectedGroup?.group_title


    const temmateTitle = () => {
      if (temateTitle) {
        return temateTitle
      } else if (tematesToAdd[0]?.getFullName()) {
        return tematesToAdd[0]?.getFullName()
      } else {
        return "Temates"
      }
    }
    const windowWidth = Dimensions.get("window").width
    const windowHeight = Dimensions.get("window").height
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable
              style={styles.back}
              onPress={() => { App.rootNavigation.pop(), App.addTemates.reset() }}
            >
              <Image source={arrow} />
            </Pressable>
            <Text style={styles.CalendarText}>THE TĒM APP</Text>
            <TouchableOpacity
              style={styles.action}
              // onPress={()=>openEditEvent()}
              onPress={() => { navigation.navigate("Calendar"), App.addTemates.reset() }}
            >
              <Icon
                name="close"
                style={{ fontSize: 20, fontWeight: "600", color: "#fff" }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.heading}>NEW EVENT</Text>
          </View>
          <View style={styles.lineWithWarning}>
            <Text style={styles.eventText} >Event Name*</Text>
            <InputBadgeDark
              model={e.title}
              // label="Event Name*"
              // labelColor="#0B82DC"
              // style={{ top: 5, marginBottom: 5, }}
            />
            <Text
              style={[
                styles.validationMessage,
                { color: showInvalidTitle ? DangerColor : "transparent" },
              ]}
            >
              Please enter title
            </Text>
          </View>
          {/* <Text style={{ color: '#0B82DC', }}>Start</Text> */}
          <DatePicker
            label="Start Date"
            icon="calendar-alt"
            title="Start"
            color="#fff"
            manager={startDateEditor}
            labelBackgroundColor="white"
            onDateChange={(date: any) => {
              startDateEditor.setValue(date)
            }}
            style={{marginBottom:30}}
            // style={styles.line}
            minimumDate={new Date()}
          />

          <View style={styles.lineWithWarning}>
            <DatePicker
              label="End Date"
              icon="calendar-alt"
              color="#fff"
              title="End"
              onDateChange={(date: any) => endDateEditor.setValue(date)}
              manager={endDateEditor}
              labelBackgroundColor="white"
              minimumDate={editor.startDateEditor.date || new Date()}
            />
            {/* <Text
              style={[
                styles.validationMessage,
                { color: showInvalidEnd ? DangerColor : "transparent" },
              ]}
            >
              Please enter end date
            </Text> */}
          </View>
          <Neomorph
            inner // <- enable shadow inside of neomorph
            style={{
              marginTop: 20,
              marginBottom: 20,
              shadowRadius: 1,
              borderRadius: 1,
              shadowColor: "#fff",
              shadowOffset: { width: 4, height: 4 },
              elevation: 2,
              backgroundColor: "",
              width: (windowWidth / 100) * 100,
              height: (windowHeight / 100) * 1,
            }}
          />
          <View>
            <Text style={{ color: "#0B82DC", marginLeft: 35, marginTop: 8 }}>
              Event Details
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={[styles.inputContainer, { marginBottom: -10 }]}>
              <Text style={styles.boxText}>Description</Text>
              <CheckBoxComp
                model={u.showDesc}
                customCheckBox
                background="#3e3e3e"
                shadow="#fff"
              />
            </View>
            {u.showDesc.value && (
              <InputBadgeDark
                model={e.description}
                style={[{ width: "97%" }, { marginTop: 20 }]}
                placeholder="description"
              />
            )}
          </View>
          <Text
            style={[
              styles.validationMessage,
              { color: showInvalidDescription ? DangerColor : "transparent" },
              , { marginTop: 10 }]}
          >
            Please enter description
          </Text>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={styles.inputContainer}>
              <Text style={styles.boxText}>
                {editorRef?.locationString.value
                  ? editorRef.locationString.value
                  : "Location"}
              </Text>

              <CheckBoxComp
                isPress
                onPress={() => {
                  App.rootNavigation.push("SearchUserLocation", {
                    manager: editor.location,
                  })
                }}
                model={editorRef.isLocation}
                background="#3e3e3e"
                shadow="#fff"
                customCheckBox
              />
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={styles.inputContainer}>
              <Text style={styles.boxText}>Recurring</Text>
              <CheckBoxComp
                model={u.Recurring}
                background="#3e3e3e"
                shadow="#fff"
                customCheckBox
              />
            </View>
            {u.Recurring.value && (
              <PickerBadge<EventRecurrence>
                pressableAreaStyle={styles.pressableStyle}
                style={styles.line}
                manager={editor.recurrence}
                renderPickerItem={(recurrence) => (
                  <Text style={styles.option}>
                    {EventRecurrenceNameMap.get(recurrence)}
                  </Text>
                )}
                renderSelectedItem={(recurrence) => (
                  <Text
                    style={{
                      color: "white",
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                    }}
                  >
                    {EventRecurrenceNameMap.get(recurrence)}
                  </Text>
                )}
              />
            )}
          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={styles.inputContainer}>
              <Text style={styles.boxText}>Event Type</Text>
              <TouchableOpacity onPress={() => Alert.alert("presss")}>
                <CheckBoxComp
                  model={u.Type}
                  background="#3e3e3e"
                  shadow="#fff"
                  customCheckBox
                />
              </TouchableOpacity>
            </View>
            {u.Type.value && (
              <PickerBadge
                editable={!updating}
                manager={typeManager}
                pressableAreaStyle={styles.pressableStyle}
                renderEmptyPicker={() => (
                  <Text
                    style={{
                      color: "lightgray",
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                    }}
                  >
                    {/* Preserve height */}
                  </Text>
                )}
                renderPickerItem={(item) => (
                  <Text style={styles.visibilityPickerText}>
                    {getEventTypeText(item)}
                  </Text>
                )}
                renderSelectedItem={(item, _index, readonly) => {
                  return (
                    <Text
                      style={{
                        color: readonly ? "lightgray" : "white",
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                      }}
                    >
                      {getEventTypeText(item)}
                    </Text>
                  )
                }}
              />
            )}
          </View>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() =>
              doAsync(async () => {
                await App.addTemates.open({
                  tematesToAddRef: editorRef.members,
                  selectedTemRef: editorRef.selectedGroup,
                  doNotMixTemAndTemates: true,
                })
              })
            }
          >
            <View style={styles.inputContainer}>
              <Text style={styles.boxText}>
                {temmateTitle()}
                {/* {temateTitle ? temateTitle : "Temates"} */}
              </Text>
              <CheckBoxComp
                model={u.Temmate}
                background="#3e3e3e"
                shadow="#fff"
                customCheckBox
              />
            </View>
          </TouchableOpacity>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={styles.inputContainer}>
              <Text style={styles.boxText}>Visibility</Text>
              <CheckBoxComp
                model={u.Visibility}
                background="#3e3e3e"
                shadow="#fff"
                customCheckBox
              />
            </View>
            {u.Visibility.value && (
              <PickerBadge
                manager={visibilityManager}
                pressableAreaStyle={styles.pressableStyle}
                renderEmptyPicker={() => (
                  <Text style={{ color: "lightgray" }}>
                    {/* Preserve height */}
                  </Text>
                )}
                renderPickerItem={(item) => (
                  <Text style={styles.visibilityPickerText}>
                    {getEventVisibilityText(item)}
                  </Text>
                )}
                renderSelectedItem={(item) => {
                  return (
                    <Text
                      style={{
                        color: "white",
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                      }}
                    >
                      {getEventVisibilityText(item)}
                    </Text>
                  )
                }}
              />
            )}
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={styles.inputContainer}>
              <Text style={styles.boxText}>REMINDER (30 min before)</Text>
              <CheckBoxComp
                model={e.eventReminder}
                background="#3e3e3e"
                shadow="#fff"
                customCheckBox
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.journal}
            // onPress={() => {
            //   addEvent(e);
            // }}
            onPress={() =>
              doAsync(async () => {
                const isValid = editor.validate() // sets isInvalid flag
                try {
                  if (isValid) {
                    if (
                      updating &&
                      editor.event.reccurEvent !== EventRecurrence.Single
                    ) {
                      App.actionModal.show(saveActions)
                    } else {
                      await addEvent(e)
                      //  saveChanges(EventScope.AllFutureEvents);
                    }
                    {
                      navigation.goBack()
                    }
                  } else {
                    ToastAndroid.show(
                      "Please check event details",
                      ToastAndroid.SHORT
                    )
                  }
                } catch (e) {
                  ToastAndroid.show(e.message, ToastAndroid.SHORT)
                }
              })
            }
          >
            <Text style={styles.journalText}>
              {updating ? "Update" : "Save"}
            </Text>
            <CircularProgress
              barWidth={2}
              trailColor="#fff"
              fill={100}
              strokeColor="#c900e6c2"
              radius={28}
              styles={{ justifyContent: "center", alignItems: "center" }}
            ></CircularProgress>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  })
}

const Margin = 20
const windowWidth = Dimensions.get("window").width
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#2e2e2e",
    flex: 1,
  },
  eventText: {
    color: '#0B82DC',
    marginLeft: 35
  },
  lineWithWarning: {
    paddingTop:10
  },
  validationMessage: {
    color: DangerColor,
    fontSize: 12,
    left: 23,
  },
  line: {
    color: "white",
  },
  switch: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Margin / 2,
  },
  option: {
    padding: 15,
    backgroundColor: "white",
    fontSize: 17,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
  },
  visibilityPickerText: {
    padding: 15,
    backgroundColor: "white",

    fontSize: 17,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
  },
  button: {
    alignItems: "center",
    marginVertical: Margin / 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#2e2e2e",
  },
  back: {
    margin: 10,
  },
  current: {
    borderWidth: 0,
    padding: 0,
    backgroundColor: "transparent",
  },
  title: {
    flex: 1,
  },

  CalendarText: {
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#000000",
  },
  action: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e2e2e",
    margin: 10,
    width: 40,
    height: 40,
    borderRadius: 25,
    borderColor: "white",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  heading: {
    color: "#0B82DC",
    fontSize: 15,
    margin: 30,
    fontWeight: "600",
  },
  inputContainer: {
    alignItems: "center",
    display: "flex",
    height: 40,
    marginVertical: 10,
    flexDirection: "row",
    borderRadius: 5,
    justifyContent: "space-between",
    width: "85%",
    backgroundColor: "#2e2e2e",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.58,
    shadowRadius: 8.0,
    elevation: 2,
  },
  boxText: {
    color: "#fff",
    marginLeft: 10,
    width: (windowWidth / 100) * 65,

  },
  journal: {
    backgroundColor: "#3d3d3d",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 15,
  },
  journalText: {
    fontSize: 12,
    color: "#0B82DC",
    position: "absolute",
    textAlign: "center",
    width: "100%",
    borderColor: "#FFFFFF",
    fontWeight: "600",
    textShadowColor: "rgba(240,240,255,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: "#FFFFFF",
  },
  pressableStyle: {
    backgroundColor: "#2e2e2e",
    margin: 10,
    borderRadius: 5,
    marginRight: 20,
    marginLeft: 20,
    width: "86%",
    height: 35,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 2,
  },
})
