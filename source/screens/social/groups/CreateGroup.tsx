//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from "react"
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StackScreenProps } from "@react-navigation/stack"
import { SocialStackPropsPerPath } from "navigation/params"
import Dummy from "assets/images/user-dummy.png"
import ActImage from "assets/icons/act/act.png"
import { ScrollView } from "react-native-gesture-handler"
import AImage from "react-native-autosize-image"
import { InputBadge } from "components/InputBadge"
import { MultiplePickerBadge } from "components/MultiplePickerBadge"
import { useOnFocus } from "common/useOnFocus"
import { App } from "models/app/App"
import { Ref, Transaction } from "reactronic"
import { Interest } from "models/data/Interest"
import { reactive } from "common/reactive"
import Icon from "react-native-vector-icons/FontAwesome5"
import { Api } from "models/app/Api"
import { GrayColor, MainBlueColor } from "components/Theme"
import { ChatHeader } from "components/Header"
import CircularProgress from "components/CircularProgress"
import { CheckBoxComp } from "components/CheckBoxComp"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { PressableBadge } from "components/PressableBadge"
import { doAsync } from "common/doAsync"

export function CreateGroup(
  p: StackScreenProps<SocialStackPropsPerPath, "CreateGroup">
): React.ReactElement {
  useOnFocus(p.navigation, () => {
    void App.interests.reload()
  })
  // const model = p.route.params.model;

  const isFocused = useIsFocused()
  const navigation = useNavigation()
  const createGroup = App.social.createGroup
  console.log("createGroup111111111111111111", createGroup)
  useEffect(() => {
    Transaction.run(() => {
      createGroup.imageUri = undefined
    })
  }, [!isFocused])

  return reactive(() => {
    const u = Ref.to(App.user)
    const user = App.user

    return (
      <SafeAreaView style={styles.screen}>
        <ChatHeader
          rightIcon="cross"
          rightOnPress={() => {createGroup.resetGroup(),navigation.goBack()}}
        />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.headingtext}>TEM INFO</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.imageContainer}>
            <View>
              <CircularProgress
                trailColor="#000000b5"
                fill={100}
                barWidth={5}
                radius={45}
                strokeColor="#BF36BD"
                styles={false}
              >
                <View style={[styles.container]}>
                  <Pressable onPress={() => createGroup.selectImage()}>
                    <Image
                      source={
                        createGroup.imageUri
                          ? { uri: createGroup.imageUri }
                          : Dummy
                      }
                      style={styles.image}
                    />
                  </Pressable>
                </View>
              </CircularProgress>
            </View>
          </View>
          <View style={styles.inputRow}>
            <InputBadge
              style={styles.input}
              placeholder="Name"
              onBlur={() => App.user.groupNameCheck()}
              model={Ref.to(createGroup).name}
              error="Please enter the name of your tēm"
              showError={Ref.to(createGroup).showNameValidationError}
            />
            <CheckBoxComp
              model={u.groupName}
              background="#f7f7f7"
              shadow="#979797"
              customCheckBox
            />
          </View>
          <View style={styles.inputRow}>
            <InputBadge
              style={styles.input}
              onBlur={() => App.user.groupDescCheck()}
              placeholder="Description"
              model={Ref.to(createGroup).description}
              error="Please enter the description of your tēm"
              showError={Ref.to(createGroup).showDescValidationError}
            />
            <CheckBoxComp
              model={u.groupDescription}
              background="#f7f7f7"
              shadow="#979797"
              customCheckBox
            />
          </View>
          <View style={styles.inputRow}>
            <TouchableOpacity

              onPress={() => {
                void App.addTemates.open({
                  tematesToAddRef: Ref.to(App.social.createGroup)
                    .selectedTemates,
                })
              }}>
              <InputBadge
                style={styles.input}
                editable={false}
                placeholder="TĒMATES"
                error="Please add at least one tēmate to your tēm"
                showError={Ref.to(createGroup).showParticipantsValidationError} />

            </TouchableOpacity>
            <CheckBoxComp
              model={u.isTemate}
              background="#f7f7f7"
              shadow="#979797"
              customCheckBox
            />
          </View>
          <Participants />
          {App.interests.all.length > 0 && (
            <View style={styles.inputRow}>
              <MultiplePickerBadge
                label="Interests"
                multiPickerStyle={styles.pickerStyle}
                icon={ActImage}
                options={App.interests.all}
                model={Ref.to(App.interests).selected
                }
                renderEmptyPicker={() => (
                  <Text
                    style={{
                      color: "#707070",
                      position: "absolute",
                      bottom: 15,
                      left: 20,
                      fontSize: 10,
                    }}
                  >
                    Interest
                  </Text>
                )}
                renderPickerItem={renderInterest}
                renderSelectedItems={renderSelectedInterests}
                getKey={Interest.getKey}
                showError={Ref.to(createGroup).showInterestValidationError}
              />
              <CheckBoxComp
                model={u.isInterest}
                background="#f7f7f7"
                shadow="#979797"
                customCheckBox
              />
            </View>
          )}
          {/* <View style={styles.inputRow}> */}
          <View style={styles.checboxView}>
            <Pressable
              onPress={() =>
                Transaction.run(() => {
                  createGroup.visibility = "private"
                  App.user.private = true
                  App.user.temates = false
                  App.user.public = false
                })
              }
              style={{ flexDirection: "column" }}
            >
              <Text style={styles.visibleText}>Private</Text>
              <CheckBoxComp
                model={u.private}
                disabled
                background="#f7f7f7"
                shadow="#979797"
                customCheckBox
              />
            </Pressable>
            <Pressable
              onPress={() =>
                Transaction.run(() => {
                  createGroup.visibility = "temates"
                  App.user.private = false
                  App.user.temates = true
                  App.user.public = false
                })
              }
              style={{ flexDirection: "column" }}
            >
              <Text style={styles.visibleText}>TĒMATES</Text>
              <CheckBoxComp
                disabled
                model={u.temates}
                background="#f7f7f7"
                shadow="#979797"
                customCheckBox
              />
            </Pressable>
            <Pressable
              onPress={() =>
                Transaction.run(() => {
                  createGroup.visibility = "public"
                  App.user.private = false
                  App.user.temates = false
                  App.user.public = true
                })
              }
              style={{ flexDirection: "column" }}
            >
              <Text style={styles.visibleText}>Public</Text>
              <CheckBoxComp
                disabled
                model={u.public}
                background="#f7f7f7"
                shadow="#979797"
                customCheckBox
              />
            </Pressable>
          </View>

          <View style={styles.toggle}>
            <View style={styles.allow}>
              <Text style={styles.toggleLabel}>
                Allow Members to Edit Group
              </Text>
            </View>
            <CheckBoxComp
              model={Ref.to(createGroup).editableByMembers}
              background="#f7f7f7"
              shadow="#979797"
              customCheckBox
            />

            {/* <Checkbox model={Ref.to(createGroup).editableByMembers} /> */}
          </View>
          {/* <Text style={styles.toggleDescription}>
            (when enabled, all members will be able to add/remove group members,
            change group name, description, interests and avatar)
          </Text> */}

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={styles.donetext1}
              onPress={async () => {
                const id = await createGroup.submit()
                if (id) {
                  await App.social.chatList.load() // workaround
                  p.navigation.pop(2)
                  await App.openChat(id)
                }
              }}
            >
              <Text style={styles.DoneText}>Save</Text>
              <CircularProgress
                barWidth={5}
                trailColor="#C7D3CA"
                fill={100}
                strokeColor="#04FCF6"
                radius={27}
                styles={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                  transform: [{ rotate: "-190deg" }],
                }}
              ></CircularProgress>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  })
}

// const temates = App.social.createGroup.selectedTemates;
// const newData:any = temates.map((x) => {
//   x.first_name, x.last_name;
// });
// console.log("temptemp", newData);
function Participants(): React.ReactElement {
  return reactive(() => {
    const temates = App.social.createGroup.selectedTemates

    return (
      <Text
        style={{
          bottom: 40,
          left: 110,
          fontSize: 12,
          // backgroundColor:"red",

          width: 200,
        }}
        numberOfLines={1}
      >
        {temates.map((x, i) => {
          const last = i === temates.length - 1
          if (last) return `${x.first_name} ${x.last_name}`
          else return `${x.first_name} ${x.last_name}, `
        })}
      </Text>
    )
  })
}

function renderInterest(
  item: Interest,
  _: number,
  active: boolean
): React.ReactElement {
  return (
    <View style={styles.interest}>
      <View style={styles.interestContent}>
        <AImage
          source={{ uri: Api.serverUrl + item.icon }}
          tintColor="black"
          mainAxisSize={25}
          style={styles.interestIcon}
        />
        <Text style={styles.interestLabel}>{item.name}</Text>
      </View>
      {active ? <Icon name="check" color="#0096E5" size={16} /> : null}
    </View>
  )
}

function renderSelectedInterests(
  interests: Interest[],
  active: boolean
): React.ReactElement {
  console.log("interests[0].name", interests[0], typeof interests[0])
  const intrestList =
    interests[0] != undefined ? interests : [{ name: "intrest" }]
  return (
    <View style={styles.interestsPicker}>
      <Text style={styles.interestsPickerLabel} numberOfLines={1}>
        {/* {interests.map((interest, index) => `${index !== 0 ? ", " : ""}${interest.name}`
        )} */}
        {intrestList?.map((interest, index) => {
          return `${index !== 0 ? ", " : ""}${interest?.name}`
        })}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
    backgroundColor: "#F7F7F7",
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  container: {
    width: 91,
    height: 91,
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bottom: 15,
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 1000,
    marginBottom: 10,
  },
  headingtext: {
    fontWeight: "500",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    fontSize: 12,
    textTransform: "uppercase",
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
    marginHorizontal: 25,
  },

  interest: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: GrayColor,
    borderBottomWidth: 1,
  },
  interestContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  interestIcon: {
    marginVertical: 7,
  },
  interestLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  interestsPicker: {},
  interestsPickerLabel: {
    position: "absolute",
    bottom: 0,
    left: 15,
    fontSize: 12,
  },

  toggle: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 25,
    justifyContent: "space-between",
  },
  toggleLabel: {
    fontSize: 10,
    margin: 10,
    color: "#707070",
  },

  button: {
    marginTop: 10,
  },

  inputRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 10,
  },
  donetext1: {
    marginBottom: 10,
    backgroundColor: "#F7F7F7",
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.29,
    shadowRadius: 5.65,
    elevation: 2,
  },
  DoneText: {
    fontSize: 10,
    color: "#0B82DC",
    position: "absolute",
    top: 30,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginLeft: 8,
    borderColor: "#FFFFFF",
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    shadowColor: "#000",
  },
  allow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "gainsboro",
    // borderBottomWidth: 1,
    // margin: 10,
    width: "80%",
    height: 40,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  toggleDescription: {
    fontSize: 12,
    marginBottom: 10,
  },
  pickerStyle: {
    backgroundColor: "#fff",
    height: 41,
    borderRadius: 45,
    width: "78%",
    marginHorizontal: 35,
  },
  visibleText: {
    fontWeight: "500",
    marginLeft: 10,
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
  },
  checboxView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 45,
    marginRight: 10,
  },
  pressbleinput: {
    backgroundColor: "#fff",
    height: 41,
    fontSize: 16,
    width: "80%",
    marginLeft: 20,
    borderRadius: 35,
    overflow: "hidden",
  },
})
