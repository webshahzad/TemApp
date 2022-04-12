//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect, useState } from "react";
import { Transaction, Ref } from "reactronic";
import { reactive } from "common/reactive";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  Image,
  ToastAndroid,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import ChallengMetric from "./ChallengMetric";
import { EmptyProps, RootStackPropsPerPath } from "navigation/params";
import { App } from "models/app/App";
import { GoalChallengeDetailsModel } from "models/data/GoalChallengeDetailsModel";
import {
  ActivitySelectionValues,
  ChallengeType,
  DurationList,
  FundsDestinationList,
  getActivitySelectionText,
  getActivityTypeName,
  getFundsDestinationText,
  typeList,
} from "models/data/GoalOrChallenge";
import { InputBadge } from "components/InputBadge";
import { PickerBadge } from "components/PickerBadge";
import { PickerManager } from "models/app/PickerManager";
import { Checkbox } from "components/Checkbox";
import { DatePicker } from "components/DatePicker";
import { DatePickerManager } from "models/app/DatePickerManager";
import { RoundButton } from "components/RoundButton";
import { DangerColor, MainBlueColor } from "components/Theme";
import { doAsync } from "common/doAsync";
import { Bool } from "common/constants";
import { HexagonTargetSelector } from "./HexagonTargetSelector";
import { PressableBadge } from "components/PressableBadge";
import { ActivityType } from "models/data/GoalOrChallenge";
import { formatShortDate } from "common/datetime";
import ActivityImage from "assets/icons/act/act.png";
import { MultiplePickerBadge } from "components/MultiplePickerBadge";
import { ActivityData } from "models/data/Activity";
import Icon from "react-native-vector-icons/FontAwesome5";
import { DatePickerLight } from "components/DatePikerLight";
import CircularProgress from "components/CircularProgress";
import Dummy from "assets/images/user-dummy.png";
import CheckBoxComp from "components/CheckBoxComp";
import { ChatHeader } from "components/Header";
import { DrawerActions, useIsFocused, useNavigation } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from "@react-navigation/drawer";
import { GoalsAndChallengesSideMenu } from "./GoalsAndChallengesSideMenu";
import { GoalsAndChallengesMatricSideMenu } from "./GoalsAndChallengesMatricSideMenu";
import { Value } from 'react-native-reanimated'
import { TimeManager } from 'models/app/Calendar/TimeManager'
import { InputModalManager } from 'components/InputModal'
// type LocalDrawerPropsPerPath = {
//   Local: EmptyProps;
// };

// const Drawer = createDrawerNavigator<LocalDrawerPropsPerPath>();

// type LocalStackPropsPerPath = {
//   LocalScreen: EmptyProps;
// };

// export function EditGoalsAndChallengesWithSideMenu(
//   p: StackScreenProps<RootStackPropsPerPath, "EditGoalChallenge">
// ): JSX.Element {
//   return (
//     <Drawer.Navigator
//       drawerType="front"
//       drawerPosition="left"
//       drawerContent={() => <GoalsAndChallengesMatricSideMenu />}
//     >
//       <Drawer.Screen
//         name="Local"
//         component={EditGoalChallenge}
//         options={{ swipeEnabled: true }}
//       />
//     </Drawer.Navigator>
//   );
// }
// export function LocalStackScreen(
//   p: DrawerScreenProps<LocalDrawerPropsPerPath, "Local">
// ): JSX.Element {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="LocalScreen"
//         component={EditGoalChallenge}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// }

// const Stack = createStackNavigator<LocalStackPropsPerPath>();
// export function EditGoalChallenge(
//   p: StackScreenProps<LocalStackPropsPerPath, "LocalScreen">

type LocalDrawerPropsPerPath = {
  LocalStack: EmptyProps;
};

const Drawer = createDrawerNavigator<LocalDrawerPropsPerPath>();

type LocalStackPropsPerPath = {
  Local: EmptyProps;
};

export function GoalsAndChallengesWithSideMenu(
  p: StackScreenProps<RootStackPropsPerPath, "GoalsAndChallenges">
): JSX.Element {
  return (
    <Drawer.Navigator
      drawerType="front"
      drawerPosition="right"
      drawerContent={() => <GoalsAndChallengesMatricSideMenu />}
    >
      <Drawer.Screen
        name="LocalStack"
        component={LocalStack}
        options={{ swipeEnabled: true }}
      />
    </Drawer.Navigator>
  );
}

const Stack = createStackNavigator<LocalStackPropsPerPath>();

function LocalStack(
  p: DrawerScreenProps<LocalDrawerPropsPerPath, "LocalStack">
): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Local"
        component={EditGoalChallenge}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export function EditGoalChallenge1(p: any): JSX.Element {
  return (
    <Drawer.Navigator
      drawerType="front"
      drawerPosition="right"
      drawerContent={() => <GoalsAndChallengesMatricSideMenu />}
    >
      <Drawer.Screen
        name="EditGoalChallenge"
        component={EditGoalChallenge}
        options={{ swipeEnabled: true }}
      />
    </Drawer.Navigator>
  );
}


export function EditGoalChallenge(p: StackScreenProps<RootStackPropsPerPath,  'EditGoalChallenge'>): JSX.Element {
  const model = p.route.params.model;
  const gncType = model.gncType;
  const activityTypeName = getActivityTypeName(gncType);
  const isChallenge: boolean = gncType === ActivityType.Challenge;
  const isNew: boolean = p.route.params.isNew;
  const createGroup = App.social.createGroup;
  const isFocused = useIsFocused();
  const u = Ref.to(App.user);
  const valueMetric = App.user.valueMetric; 

 
  useEffect(() => {
    p.navigation.setOptions({
      title: (isNew ? "Create" : "Edit") + " " + activityTypeName,
    });
  });
  const manager = App.goalsAndChallenges;
  useEffect(() => {
    void manager.currentTabList.loadItems();
  }, []);
  const fundraisingRef = Ref.to(model.fundraisingShadow);
  const modelRef = Ref.to(model);

console.log("modelRef,modelRef",modelRef)
const navigation = useNavigation();

  useEffect(()=>{
    Transaction.run(()=>{
     App.user.startDate= "" 
     createGroup.imageUri= undefined
     u.goalStartDate=false
    })
   },[navigation.goBack])


  const [startDateManager] = useState(() =>
    Transaction.run(
      () =>
        new DatePickerManager({
          model: modelRef.startDatePickerValue,
          convertToString: true,
          format: formatShortDate,
        })
    )
  );
  const [durationPickerManager] = useState(() =>
    Transaction.run(() => new PickerManager(DurationList, modelRef.duration))
  );
  const [typePickerManager] = useState(() =>
    Transaction.run(() => new PickerManager(typeList, modelRef.type))
  );
  const [activitySelectionManager] = useState(() =>
    Transaction.run(
      () => new PickerManager(ActivitySelectionValues, modelRef.anyActivity)
    )
  );
  const [fundsDestinationPickerManager] = useState(() =>
    Transaction.run(
      () => new PickerManager(FundsDestinationList, fundraisingRef.destination)
    )
  );

  return reactive(() => {
    // Validation
    const showInvalidName = model.isInvalid && !model.hasValidName;
    const showInvalidDescription = model.isInvalid && !model.hasValidDescription;
    const showInvalidStartDate = model.isInvalid && !model.hasValidStartDate;
    const showInvalidDuration = model.isInvalid && !model.hasValidDuration;
    const showInvalidActivity = model.isInvalid && !model.hasValidActivities;
    const showInvalidTemates = model.isInvalid && !model.hasValidMembers;
    const showInvalidTem1 = model.isInvalid && !model.hasValidTem1;
    const showInvalidTem2 =
      model.isInvalid && !(model.hasValidTem2 && model.hasValidTemsPair);
    const showInvalidFundsDestination =
      model.isInvalid && !model.hasValidFundsDestination;
    const showInvalidFundsAmount =
      model.isInvalid && !model.hasValidFundsAmount;
    const createChallenge = model;

   

    // const startDate =  App.user.startDate;
   
    const navigation = useNavigation();
    const renderItem = (id:number): any => {
      if (id == 1) {
        return "individual vs individual";
      } else if (id == 2) {
        return "individual vs tem";
      } else if (id == 3) {
        return "tem vs tem";
      }
    };

    return (
      <SafeAreaView style={styles.screen}>
        <ChatHeader rightIcon="cross" rightOnPress={()=> navigation.navigate("GoalsAndChallenges")}/>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.goaltext}>
              {isChallenge ? "CHALLENGE" : "GOAL"}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <View>
              <CircularProgress
                trailColor="#000000b5"
                // fill={completion}
                fill={80}
                barWidth={5}
                radius={45}
                strokeColor="#BF36BD"
                styles={false}
              >
                <View style={[styles.containerimg]}>
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
          {isChallenge && (
            <>
              <View style={styles.inputfirst}>
                <View style={[styles.input,{marginBottom:20}]}>
                  <PickerBadge
                    pressableAreaStyle={styles.pressbleinput}
                    manager={typePickerManager}
                    renderEmptyPicker={() => (
                      <Text
                        style={{
                          flex: 1,
                          paddingVertical: 5,
                          color: "#707070",
                          position: "absolute",
                          fontSize: 13,
                          left: 15,
                          top: 5,
                        }}
                      >
                        Type
                      </Text>
                    )}
                    renderPickerItem={(item) => (
                      <Text
                        style={{
                          padding: 15,
                          backgroundColor: "white",
                          fontSize: 12,
                          textAlign:"center",
                          fontWeight: "500",
                          color: "#3e3e3e",
                          borderBottomColor: "lightgray",
                          borderBottomWidth: 1,
                        }}
                      >
                        {renderItem(item)}
                      </Text>
                    )}
                    renderSelectedItem={(item) => {
                     
                      return (
                        <Text
                          style={{
                            flex: 1,
                            color: "#2e2e2e",
                            position: "absolute",
                            bottom: 12,
                            fontSize: 12,
                            left: 15,
                          }}
                        >
                          {renderItem(item)}
                        </Text>
                      );
                    }}
                  />
                  <CheckBoxComp
                    model={u.challengeType}
                    background="#f7f7f7"
                    shadow="#979797"
                    bottom={10}
                    left={1}
                    customCheckBox
                  />
                </View>
              </View>
              {/*  */}
              {/* <View style={styles.input}>
              <Text style={styles.challengeTypeCaption}>TYPE</Text>
              <ChallengeTypeSelector model={modelRef.type} />
            </View> */}
            </>
          )}
          {/* <View style={styles.inputfirst}> */}
          <View style={styles.input}>
            <InputBadge
              placeholder="Name"
              model={modelRef.name}
              onBlur={() => App.user.challengeNameCheck(modelRef.name)}
              contentStyle={{ width: "91%" ,marginLeft: 10,marginRight:5 }}
            />
            <CheckBoxComp
              model={u.challengeName}
              background="#f7f7f7"
              shadow="#979797"
              customCheckBox
              right={30}
            />
          </View>
          <Text
            style={[
              styles.validationMessage,
              { color: showInvalidName ? DangerColor : "transparent" },
            ]}
          >
            Please enter name
          </Text>
          {/* </View> */}

          {/* <View style={styles.inputfirst}> */}
          <View style={styles.input}>
            <InputBadge
              // label='Description'
              // icon='file'
              placeholder="Description"
              // labelBackgroundColor='white'
              model={modelRef.description}
              onBlur={() => App.user.challengeDescCheck(modelRef.description)}
              contentStyle={{ width: "91%", marginLeft: 10 }}
            />
            <CheckBoxComp
              model={u.challengeDesc}
              background="#f7f7f7"
              shadow="#979797"
              customCheckBox
              right={30}
            /> 
             <Text
            style={[
              styles.validationMessage,
              { color: showInvalidDescription? DangerColor : "transparent" },
            ]}
          >
            Please select description
          </Text>
          </View>
          <Text
            style={[
              styles.validationMessage,
              { color: "transparent" },
            ]} /* DO NOT REMOVE !!! Preserves height */
          ></Text>
          {/* </View> */}
          <View style={styles.inputfirst}>
            <View style={styles.inputDate}>
              <View style={styles.shadbox}>
                <DatePickerLight
                  label="Start Date"
                  // labelBackgroundColor="white"
                  // start date from now
                  manager={startDateManager}
                  onDateChange={(date: any) => {
                    Transaction.run(() => {
                      App.user.startDate = date
                      u.goalStartDate=true
                    });
                  }}
                  minimumDate={new Date()}
                  editable={isNew}
                  
                />
              </View>
              <View style={{ position: "absolute", right: -40 }}>
                <CheckBoxComp
                  model={u.goalStartDate}
                  background="#f7f7f7"
                  shadow="#979797"
                  customCheckBox
                />
              </View>
            </View>

            <Text
              style={[
                styles.validationMessage,
                { color: "#333", position: "absolute", top: 23, left: 65 },
              ]}
            >
              {App.user.startDate}
            </Text>
            <Text
              style={[
                styles.validationMessage,
                { color: showInvalidStartDate ? DangerColor : "transparent" },
              ]}
            >
              Please select start date
            </Text>
          </View>
          <View style={styles.inputfirst}>
            <View style={styles.input}>
              <PickerBadge
                pressableAreaStyle={styles.pressbleinput}
                manager={durationPickerManager}
                renderEmptyPicker={() => (
                  <Text
                    style={{
                      flex: 1,
                      // paddingVertical: 5,
                      color: "#707070",
                      position: "absolute",
                      fontSize: 12,
                      left: 15,
                      top: 12,

                    }}
                  >
                    Duration
                  </Text>
                )}
                renderPickerItem={(item) => (
                  <Text
                    style={{
                      padding: 15,
                      backgroundColor: "white",
                      fontSize: 17,
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                    }}
                  >
                    {item}
                  </Text>
                )}
                renderSelectedItem={(item) => {
                  return (
                    <Text
                      style={{
                        flex: 1,
                        color: "#3e3e3e",
                        position: "absolute",
                        bottom: 13,
                        fontSize: 13,
                        left: 13,
                      }}
                    >
                      {item}
                    </Text>
                  );
                }}
              />
              <CheckBoxComp
               model={modelRef.durationCheck}
                background="#f7f7f7"
                shadow="#979797"
                customCheckBox
                bottom={10}
                left={1}
              />
            </View>
            <Text
              style={[
                styles.validationMessage,
                { color: showInvalidDuration ? DangerColor : "transparent" },
              ]}
            >
              Please enter duration
            </Text>
          </View>
          <View style={styles.inputfirst}>
            <View style={styles.input}>
              <PickerBadge
                pressableAreaStyle={styles.pressbleinput}
                manager={activitySelectionManager}
                renderEmptyPicker={() => (
                  <Text style={{ flex: 1, color: "#707070", fontSize: 13 }}>
                    Activity Selection
                  </Text>
                )}
                renderPickerItem={(item) => (
                  <Text
                    style={{
                      padding: 15,
                      backgroundColor: "white",
                      fontSize: 17,
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                    }}
                  >
                    {getActivitySelectionText(item)}
                  </Text>
                )}
                renderSelectedItem={(item) => {
                  return (
                    <Text
                      style={{
                        flex: 1,
                        paddingVertical: 5,
                        color: "#707070",
                        position: "absolute",
                        bottom: 10,
                        fontSize: 13,
                        left: 13,
                      }}
                    >
                      {getActivitySelectionText(item)}
                    </Text>
                  );
                }}
              />
              <CheckBoxComp
                model={modelRef.anyActivity}
                background="#f7f7f7"
                shadow="#979797"
                customCheckBox
                bottom={10}
                left={1}
              />
            </View>
            <Text
              style={[
                styles.validationMessage,
                { color: showInvalidDuration ? DangerColor : "transparent" },
              ]}
            >
              Please enter Activity Selection
            </Text>
          </View>
          {!model.anyActivity && (
            <>
              <View style={styles.inputfirst}>
                <View style={styles.input}>
                  <MultiplePickerBadge<ActivityData>
                    multiPickerStyle={{
                      backgroundColor: "#fff",
                      height: 41,
                      borderRadius: 35,
                      width: "80%",
                      marginLeft: 20,
                    }}
                    label="Activity"
                    options={App.activityManager.activityListForGoals}
                    // labelBackgroundColor="white"
                    icon={ActivityImage}
                    model={modelRef.activityPickerValues}
                    doBeforeOpen={async (manager) => {
                      if (App.activityManager.needToLoadActivityListForGoals) {
                        await App.activityManager.loadActivityListForGoals();
                      }
                      manager.setOptions(
                        App.activityManager.activityListForGoals
                      );
                    }}
                    renderEmptyPicker={() => (
                      <Text
                        style={{
                          flex: 1,
                          color: "#707070",
                          fontSize: 13,
                          position: "absolute",
                          bottom: 13,
                          left: 13,
                        }}
                      >
                        Activity Selection
                      </Text>
                    )}
                    renderPickerItem={(item, _index, active) => (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: 15,
                          paddingLeft: 10,
                          borderBottomColor: "lightgray",
                          borderBottomWidth: 1,
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              height: 30,
                              width: 30,
                              resizeMode: "contain",
                              marginRight: 10,
                            }}
                          />
                          <Text
                            style={{ backgroundColor: "white", fontSize: 17 }}
                          >
                            {item.name}
                          </Text>
                        </View>
                        {active ? (
                          <Icon name="check" color="#0096E5" size={16} />
                        ) : null}
                      </View>
                    )}
                    renderSelectedItems={(items) => {
                      return (
                        <Text
                          style={{
                            flex: 1,
                            paddingVertical: 5,
                            color: "#000",
                            position: "absolute",
                            bottom: 6,
                            left: 13,
                          }}
                          numberOfLines={1}
                        >
                          {items.map((item) => item.name).join(", ")}
                        </Text>
                      );
                    }}
                    getKey={(item) => item.id.toString()}
                  />
                  <CheckBoxComp
                   model={modelRef.goalActivitySelectionCheck}
                    background="#f7f7f7"
                    shadow="#979797"
                    customCheckBox
                    bottom={10}
                    left={1}
                  />
                </View>
                <Text
                  style={[
                    styles.validationMessage,
                    {
                      color: showInvalidActivity ? DangerColor : "transparent",
                    },
                  ]}
                >
                  Please select activity type
                </Text>
              </View>
            </>
          )}
          {isChallenge && model.type == ChallengeType.TeamVsTeam ? (
            <>
              <View style={styles.inputfirst}>
                <View style={styles.input}>
                  <PressableBadge
                    pressableAreaStyle={styles.pressbleinput}
                    placeholder='Temates 1'
                    onPress={() =>
                      doAsync(async () => {
                        await App.addTemates.open({
                          selectedTemRef: modelRef.tem1,
                          showPublicTems:
                            App.user.stored.isCompanyAccount === Bool.True,
                        });
                      })
                    }
                    text={modelRef.tem1String}
                  />

                  <CheckBoxComp
                    model={u.goalTēm1}
                    background="#f7f7f7"
                    shadow="#979797"
                    customCheckBox
                    bottom={10}
                    left={1}
                  />
                </View>
                <Text
                  style={[
                    styles.validationMessage,
                    { color: showInvalidTem1 ? DangerColor : "transparent" },
                  ]}
                >
                  Please select tēm 1
                </Text>
              </View>
              <View style={styles.inputfirst}>
                <View style={styles.input}>
                  <PressableBadge
                   placeholder='Temates 2'
                    pressableAreaStyle={styles.pressbleinput}
                    onPress={() =>
                      doAsync(async () => {
                        await App.addTemates.open({
                          selectedTemRef: modelRef.tem2,
                          showPublicTems: true,
                        });
                      })
                    }
                    text={modelRef.tem2String}
                  />
                  <CheckBoxComp
                    model={u.goalTēm2}
                    background="#f7f7f7"
                    shadow="#979797"
                    customCheckBox
                    bottom={10}
                    left={1}
                  />
                </View>
                <Text
                  style={[
                    styles.validationMessage,
                    { color: showInvalidTem2 ? DangerColor : "transparent" },
                  ]}
                >
                  {model.hasValidTemsPair
                    ? "Please select Tēm 2"
                    : "Please select Tēm 2 different from Tēm 1"}
                </Text>
              </View>
            </>
          ) : (
            // Goal or not teams-only Challenge
            <View style={styles.inputfirst}>
              <View style={styles.input}>
                <PressableBadge
                 placeholder='Temates'
                  pressableAreaStyle={styles.pressbleinput}
                  textDefaultStyle={styles.textdefault}
                  // label='Tēmates'
                  // icon={TematesImage}
                  // labelBackgroundColor='white'
                  onPress={() =>
                    doAsync(async () => {
                      await App.addTemates.open({
                        tematesToAddRef: modelRef.temates,
                        selectedTemRef: modelRef.groupDetail,
                      });
                    })
                  }
                  text={modelRef.tematesString}
                  textStyle={{ position: "absolute", left: 10, top: 5,}}
                />
                <CheckBoxComp
                  model={modelRef.challengeTematesChec}
                  background="#f7f7f7"
                  shadow="#979797"
                  customCheckBox
                  bottom={10}
                  left={1}
                />
              </View>
              <Text
                style={[
                  styles.validationMessage,
                  { color: showInvalidTemates ? DangerColor : "transparent" },
                ]}
              >
                {isChallenge && model.type === ChallengeType.UserVsTeam
                  ? "Please select a Tēm for challenge"
                  : "Please select at least one tēmate"}
              </Text>
            </View>
          )}
         { isChallenge ?
          <View style={styles.inputfirst}>
            <View style={styles.input}>
              <PressableBadge
                // onPress={() => {
                //   Transaction.run(() => (App.user.metricDrawer = true));
                // }}                 
                pressableAreaStyle={styles.pressbleinput}
                placeholder='Metrics'
                // icon={TematesImage}
                labelBackgroundColor="white"
                text={modelRef.matric}
                
                textStyle={{color: '#000',position:'absolute',left: 13,top:5}}
              
              />
              <CheckBoxComp
                model={u.goalMatric}
                background="#f7f7f7"
                shadow="#979797"
                customCheckBox
              />
            </View>
            <Text
              style={[
                styles.validationMessage,
                { color: showInvalidTemates ? DangerColor : "transparent" },
              ]}
            >
              {isChallenge && model.type === ChallengeType.UserVsTeam
                ? "Please select a Tēm for challenge"
                : "Please select at least one tēmate"}
            </Text>
          </View> 
          : 
          <View style={styles.inputfirst}>
            <View style={styles.input}>
              <PressableBadge
                // onPress={() => {
                //   Transaction.run(() => (App.user.metricDrawer = true));
                // }}                 
                pressableAreaStyle={styles.pressbleinput}
                placeholder={`Matric`}
                // icon={TematesImage}
                labelBackgroundColor="white"  
              
                text={modelRef.targetValue}
                textStyle={{color: '#000',position:'absolute',left: 13,top:5}}
              
              />
              <CheckBoxComp
                model={u.goalMatric}
                background="#f7f7f7"
                shadow="#979797"
                customCheckBox
              />
            </View>
            <Text
              style={[
                styles.validationMessage,
                { color: showInvalidTemates ? DangerColor : "transparent" },
              ]}
            >
              {isChallenge && model.type === ChallengeType.UserVsTeam
                ? "Please select a Tēm for challenge"
                : "Please select at least one tēmate"}
            </Text>
          </View>}
          {App.user.stored.isCompanyAccount == Bool.True && (
            <View style={styles.switchContainer}>
              <View>
                <Text
                  style={[
                    styles.switchLabel,
                    { color: "red", fontWeight: "bold" },
                  ]}
                >
                  Do Not Participate
                </Text>
              </View>
              <Checkbox
                model={modelRef.doNotParticipate}
                dangerous
                style={styles.switch}
              />
              {/* <CheckBoxComp
                      model={modelRef.doNotParticipate}
                      background="#f7f7f7"
                      shadow="#979797"
                      customCheckBox
                      dangerous style={styles.switch}
                    /> */}
            </View>
          )}
          {/* {model.canBeOpenToPublic && (
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Open To Public</Text>
              <CheckBoxComp
                model={modelRef.isOpen}
                background="#f7f7f7"
                shadow="#979797"
                customCheckBox
                style={styles.switch}
              />
            </View>
          )} */}
          {/* <TouchableOpacity
            onPress={() => p.navigation.dispatch(DrawerActions.openDrawer())}
          >
            
          </TouchableOpacity> */}
          <View style={styles.inputRow}>
            <TouchableOpacity
              onPress={() => {
                Transaction.run(() => {
                  // model.challengePrivacy= "private";
                  createChallenge.visibility = "private";
                  App.user.private = true;
                  App.user.temates = false;
                  App.user.public = false;
                });
              }}
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
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Transaction.run(() => {
                  createChallenge.visibility = "temates";
                  App.user.private = false;
                  App.user.temates = true;
                  App.user.public = false;
                });
              }}
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
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Transaction.run(() => {
                  createChallenge.visibility = "public";
                  App.user.private = false;
                  App.user.temates = false;
                  App.user.public = true;
                });
              }}
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
            </TouchableOpacity>
          </View>
          {!isChallenge && (
            <View style={styles.switchContainer}>
              <View style={styles.publicView}>
                <Text style={styles.switchLabel}>Post progress to Feed</Text>
                {/* <Text style={styles.switchSubLabel}>(progress gets posted to feed)</Text> */}
              </View>
              {/* <Checkbox model={modelRef.isPublic} style={styles.switch} /> */}
              <CheckBoxComp
                model={modelRef.isPublic}
                background="#f7f7f7"
                shadow="#979797"
                customCheckBox
                right={15}
                style={styles.switch}
              />
            </View>
          )}
          <View style={styles.switchContainer}>
            <View style={styles.publicView2}>
              <Text style={styles.switchLabel}>Fundraising Event</Text>
            </View>
            {/* <Checkbox disabled={!isNew} model={modelRef.isFundraising} style={styles.switch} /> */}
            <CheckBoxComp
              model={modelRef.isFundraising}
              background="#f7f7f7"
              shadow="#979797"
              customCheckBox
              right={15}
              style={styles.switch}
            />
          </View>
          {model.isFundraising && (
            <View style={styles.subContainer}>
              <View style={styles.inputfirst}>
                <View style={styles.input}>
                  <PickerBadge
                    // label='Funds Destination'
                    // icon='user'
                    // labelBackgroundColor='black'
                    pressableAreaStyle={styles.pressbleinput}
                    editable={isNew}
                    manager={fundsDestinationPickerManager}
                    renderEmptyPicker={() => (
                      <Text
                        style={{
                          flex: 1,
                          // paddingVertical: 10,
                          position:"absolute",
                          left:13,
                          bottom:12,
                          color: "gray",
                          fontSize:12,                          
                          // justifyContent: "flex-start",
                          // alignSelf: "flex-start",
                          // backgroundColor:"red"
                        }}
                      >
                        Fund Destination
                      </Text>
                    )}
                    renderPickerItem={(item) => {
                      const text = getFundsDestinationText(item);
                      return (
                        <Text
                          style={{
                            padding: 15,
                            backgroundColor: "white",
                            fontSize: 17,
                            borderBottomColor: "lightgray",
                            borderBottomWidth: 1,
                          }}
                        >
                          {text}
                        </Text>
                      );
                    }}
                    renderSelectedItem={(item) => {
                      const text = getFundsDestinationText(item);
                      return (
                        <>
                          <Text
                            style={{
                              flex: 1,
                              paddingVertical: 5,
                              position: "absolute",
                              bottom: 1,
                              left: 13,
                              color: isNew ? "black" : "lightgrey",
                            }}
                          >
                            {text}
                          </Text>
                        </>
                      );
                    }}
                  />
                </View>
                <Text
                  style={[
                    styles.validationMessage,
                    {
                      color: showInvalidFundsDestination
                        ? DangerColor
                        : "transparent",
                    },
                  ]}
                >
                  Please select funds destination
                </Text>
              </View>
              <View style={styles.inputfirst}>
                <View style={styles.input}>
                  <InputBadge
                    // label='Goal Amount'
                    placeholder="Goals Amount"
                    keyboardType="numeric"
                    model={fundraisingRef.goalAmount}
                    contentStyle={{ width: "92%", marginLeft: 10 }}
                  />
                </View>
                <Text
                  style={[
                    styles.validationMessage,
                    {
                      color: showInvalidFundsAmount
                        ? DangerColor
                        : "transparent",
                    },
                  ]}
                >
                  Please enter goal amount
                </Text>
              </View>
            </View>
          )}
          {!isChallenge && (
            <>
              <View style={styles.switchContainer}>
                <View style={styles.Switchcontainer2}>
                  <Text style={styles.switchSubLabel}>
                    Per Person Goal (automatically increase goal)
                  </Text>
                </View>
                {/* <Checkbox model={modelRef.isPerPersonGoal} style={styles.switch} />
                 */}
                {/* <CheckBoxComp
                  model={modelRef.isPerPersonGoal}
                  background="#f7f7f7"
                  shadow="#979797"
                  customCheckBox
                  right={15}
                  style={styles.switch}
                /> */}
              </View>
            </>
          )}
          <View style={{ marginVertical: 10 }}>
            <Text
              style={{ color: "#777", textAlign: "center", marginBottom: 15 }}
            >
              {activityTypeName} metric
              {isChallenge ? ": Used to determine winner" : ""}
            </Text>
            <HexagonTargetSelector
              isChallenge={isChallenge}
              targetManager={model}
              lockMetric={!isNew}
              // valueMetric={valueMetric}
              
            />
          </View>
          <View style={styles.startContainer}>
            <TouchableOpacity
              onPress={() =>
                doAsync(async () => {
                  const isValid = model.validate(); // sets isInvalid flag
                  if (isValid) {
                  try {
                    let message: string;
                    if (isNew){
                      message = await App.goalsAndChallenges.create(model);
                     
                    }
                    else message = await App.goalsAndChallenges.update(model);
                    ToastAndroid.show(message, ToastAndroid.SHORT);
                    p.navigation.pop();
                    // } else if (!model.hasValidTarget) {
                    //   const message = isChallenge
                    //     ? "Please select at least one metric for challenge"
                    //     : "Please select one metric for goal"
                    //   Alert.alert("", message)
                    // }
                  } catch (e) {
                   
                  }
                }
                })
              }
              style={styles.donetext1}
            >
              <Text style={styles.DoneText}>{isNew ? "START" : "EDIT"}</Text>
              <CircularProgress
                barWidth={5}
                trailColor="#C7D3CA"
                fill={90}
                strokeColor="#0BF9F3"
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
        <Modal
          // animationType="slide"
          transparent={true}
          visible={App.user.metricDrawer}
          onRequestClose={() => {}}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ChallengMetric />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  });
}
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F7F7F7",
    height: "100%",
    // width: '100%',
  },
  textdefault: {
    color: "red",
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  inputfirst: {
    backgroundColor: "transparent",
    // marginLeft: 20,
  },
  inputDate: {
    width: "92%",
    display: "flex",
     },
  input: {
    // marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: 'center',
  },
  challengeTypeCaption: {
    marginTop: 5,
    fontSize: 12,
  },
  validationMessage: {
    color: DangerColor,
    fontSize: 12,
    marginHorizontal: 25,
    // position:'absolute',
    // bottom:5,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 20,
  },
  Switchcontainer2: {
    // flex: 1,
    width: "80%",
    padding: 10,
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
  switchLabel: {
    flex: 1,
    fontSize: 12,
    color: "#707070",
    textAlign: "left",
  },
  switchSubLabel: {
    flex: 1,
    textAlign: "left",
    fontSize: 12,
  },
  switch: {
    marginHorizontal: -10,
  },
  publicView2: {
    width: "80%",
    padding: 10,
    height: 50,
    marginBottom: 10,
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
  publicView: {
    width: "80%",
    padding: 10,
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
  inputRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingRight: 25,
  },
  startContainer: {
    // width: '40%',
    // alignSelf: 'center',
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    paddingTop: 15,
  },
  goaltext: {
    fontWeight: "500",
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
    fontSize: 12,
    textTransform: "uppercase",
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
    borderRadius: 1000,
    marginBottom: 10,
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
    overflow: "hidden",
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
  visibleText: {
    fontWeight: "500",
    marginLeft: 13,
    color: "#0B82DC",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    shadowColor: "#000",
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
  pressbleinput: {
    backgroundColor: "#fff",
    height: 41,
    fontSize: 16,
    width: "80%",
    marginLeft: 20,
    borderRadius: 35,
    overflow:'hidden',
    
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    // marginTop: 22
  },
  modalView: {
    height: "100%",
    // width: '80%',
    // width: (windowWidth / 100) * 70,
    backgroundColor: "white",
    paddingTop: 35,
    paddingBottom: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  shadbox:{
    marginTop:11,
    marginBottom:13,
  }
});
