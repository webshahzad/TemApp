//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import {
  ObservableObject,
  Transaction,
  transaction,
  unobservable,
  Reactronic,
  monitor,
  reaction,
  reentrance,
  Reentrance,
  TraceLevel,
  standalone,
} from "reactronic";
import { Alert, AppState, AppStateStatus } from "react-native";
import { RootNavigation } from "./RootNavigation";
import { ContactUs } from "./ContactUs";
import { Faqs } from "./Faqs";
import { ActivityManager } from "./ActivityManager";
import { User } from "models/app/User";
import { UserSearchManager } from "./UserSearchManager";
import { ChangePassword } from "./ChangePassword";
import { Leaderboard } from "models/data/Leaderboard";
import { Location } from "models/data/Location";
import { GoalFilter, GoalsAndChallenges } from "./GoalsAndChallenges";
import { GoalChallengeDetailsModel } from "../data/GoalChallengeDetailsModel";
import { TagPeople } from "models/data/TagPeople";
import { LocationManager } from "./LocationManager";
import { GymManager } from "./GymManager";
import { UserLocationManager } from "./UserLocationManager";
import { Social } from "./Social/Social";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabsPropsPerPath } from "navigation/params";
import { FriendList } from "./FriendList";
import { Interests } from "./Interests";
import { Chat } from "./Social/Chat";
import { UserInfo } from "models/data/UserInfo";
import { ActionModalManager } from "components/ActionModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ChatRoom } from "models/data/ChatRoom";
import { Notifications } from "./Notifications";
import { Feed } from "models/data/Feed";
import { Monitors } from "./Monitors";
import { Dashboard } from "./Dashboard/Dashboard";
import { AddTematesManager } from "./AddTematesManager";
import { GlobalSearchManager } from "./GlobalSearch/GlobalSearchManager";
import { Accessory } from "./Accessory";
import { Api, ApiData } from "./Api";
import { ImageViewerManager } from "./ImageViewerManager";
import { TutorialManager } from "components/Tutorial/TutorialManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityEdit, ActivitySummary } from "models/data/Activity";
import { ImageSelection } from "models/app/ImageSelection";
import { GoogleFit } from "./Fit/GoogleFit";
import { ActivityOrigin } from "./Fit/ActivityOrigin";
import { populate } from "common/populate";
import { UserId } from "models/data/UserId";

dayjs.extend(relativeTime);

Reactronic.setTraceMode(true, TraceLevel.Error);

Reactronic.setProfilingMode(true);
Reactronic.setProfilingMode(false, {
  asyncActionDurationWarningThreshold: Number.MAX_SAFE_INTEGER,
  mainThreadBlockingWarningThreshold: 5,
  repetitiveUsageWarningThreshold: Number.MAX_SAFE_INTEGER,
  garbageCollectionSummaryInterval: Number.MAX_SAFE_INTEGER,
});

const StartScreenKey = "App.startScreen";

export enum StartScreen {
  Default = 0,
  CreateProfile,
  Interests,
}

export class AppModel extends ObservableObject {
  @unobservable readonly actionModal: ActionModalManager;
  @unobservable readonly imageViewer: ImageViewerManager;
  @unobservable readonly activityManager: ActivityManager;
  @unobservable readonly user: User;
  @unobservable readonly feed: Feed;
  @unobservable readonly contactUs: ContactUs;
  @unobservable readonly faqs: Faqs;
  @unobservable readonly tutorial: TutorialManager;
  @unobservable readonly userSearchManager: UserSearchManager;
  @unobservable readonly globalSearch: GlobalSearchManager;
  @unobservable readonly changePassword: ChangePassword;
  @unobservable readonly leaderboard: Leaderboard;
  @unobservable readonly goalsAndChallenges: GoalsAndChallenges;
  // @unobservable readonly goalsAndChallengesModel: GoalChallengeDetailsModel ;
  location?: Location;
  @unobservable readonly tagPeople: TagPeople;
  @unobservable readonly locationManager: LocationManager;
  @unobservable readonly gymManager: GymManager;
  @unobservable readonly userLocationManager: UserLocationManager;
  @unobservable readonly social: Social;
  friendList?: FriendList;
  interests: Interests;
  chat?: Chat;
  @unobservable readonly notifications: Notifications;
  @unobservable readonly dashboard: Dashboard;
  @unobservable readonly addTemates: AddTematesManager;
  @unobservable readonly accessory: Accessory;
  @unobservable readonly imageSelection: ImageSelection;
  @unobservable readonly rootNavigation: RootNavigation;
  bottomTabsNavigation?: BottomTabNavigationProp<
    BottomTabsPropsPerPath,
    "Dashboard"
  > = undefined;

  @unobservable readonly googleFit: GoogleFit;

  startScreen: StartScreen = StartScreen.Default;
  state: AppStateStatus = AppState.currentState;
  hexagonText: string;
  profileStatus: number;
  isFocusUse: boolean;
  lEmailErr: boolean;
  lPassErr: boolean;
  sFnameErr: boolean;
  sLnameErr: boolean;
  sEmailErr: boolean;
  sPhoneErr: boolean;
  eventList: [];
  members: [];
  conditionErr: boolean;
  sPassErr: boolean;
  errorMsg: string;
  errorLoginMsg: string;
  startdate: number;
  isInvalid: boolean = false; // validation
  EditGoalChallenge: void
  EditGoalChallenge: void

  constructor() {
    super();
    this.activityManager = new ActivityManager();
    this.imageViewer = new ImageViewerManager();
    this.user = new User(this);
    this.feed = new Feed(this);
    this.contactUs = new ContactUs();
    this.faqs = new Faqs();
    this.tutorial = new TutorialManager();
    this.rootNavigation = new RootNavigation();
    this.userSearchManager = new UserSearchManager();
    this.changePassword = new ChangePassword();
    this.leaderboard = new Leaderboard();
    this.goalsAndChallenges = new GoalsAndChallenges(this);
    this.location = undefined;
    this.hexagonText = "";
    this.errorMsg = "";
    this.errorLoginMsg = "";
    this.isFocusUse = false;
    this.lEmailErr = false;
    this.lPassErr = false;
    this.sFnameErr = false;
    this.sLnameErr = false;
    this.sEmailErr = false;
    this.sPhoneErr = false;
    this.eventList = [];
    this.members = [];
    this.startdate = 0;
    this.sPassErr = false;
    this.conditionErr = false;
    this.profileStatus = 0;
    this.tagPeople = new TagPeople();
    this.globalSearch = new GlobalSearchManager();
    const locationManager = new LocationManager();
    this.locationManager = locationManager;
    this.gymManager = new GymManager(locationManager, (gym) =>
      populate(this.user.edited.gymAddress, gym)
    );
    this.userLocationManager = new UserLocationManager(
      locationManager,
      (location) => populate(this.user.edited.address, location)
    );
    this.social = new Social();
    this.friendList = undefined;
    this.interests = new Interests();
    this.chat = undefined;
    this.actionModal = new ActionModalManager();
    this.notifications = new Notifications();
    this.dashboard = new Dashboard(this);
    this.addTemates = new AddTematesManager();
    this.accessory = new Accessory();
    this.imageSelection = new ImageSelection();
    this.googleFit = new GoogleFit(this);

    AppState.addEventListener("change", this.setAppState);
  }

  @transaction
  private setAppState(state: AppStateStatus): void {
    this.state = state;
  }

  // Trick to eliminate drawer blink on app start

  firstRenderOfSideMenu: boolean = true;

  @transaction
  finishFirstRenderOfSideMenu(): void {
    this.firstRenderOfSideMenu = false;
  }

  @transaction
  logout(): void {
    Alert.alert("Log out?", undefined, [
      { text: "No" },
      {
        text: "Yes",
        onPress: async () => {
          await this.user.logout();
          if (this.rootNavigation.canGoBack()) this.rootNavigation.popToTop();
          this.rootNavigation.replace("LogIn");
        },
      },
    ]);
  }

  @transaction
  saveTabsNavigation(
    navigation: BottomTabNavigationProp<BottomTabsPropsPerPath, "Dashboard">
  ): void {
    this.bottomTabsNavigation = navigation;
  }

  @transaction
  loginValidate(): boolean {
    const isValid = this.hasValidUsername && this.hasValidPassword;

    this.isInvalid = !isValid;
    return isValid;
  }
  @transaction
  createProfileValidate(): boolean {
    const isValid =
      this.hasValidProfileUsername &&
      this.hasValidDateOfBirth &&
      this.hasValidWeight &&
      this.hasValidHeight &&
      this.hasValidGender &&
      this.hasValidLocation &&
      this.hasValidGymLocation;

    this.isInvalid = !isValid;
    return isValid;
  }
  @transaction
  signupValidate(): boolean {
    const isValid =
      this.hasValidfirstName &&
      this.hasValidlastName &&
      this.hasValidsignupEmail &&
      this.hasValidsignupPhone &&
      this.hasValidsignupPass;
    this.isInvalid = !isValid;
    return isValid;
  }

  @transaction
  resetTabsNavigation(): void {
    this.bottomTabsNavigation = undefined;
  }

  // Login validation
  get hasValidUsername(): boolean {
    return (
      this.user.stored.username !== undefined &&
      this.user.stored.username.trim().length > 0
    );
  }
  get hasValidPassword(): boolean {
    return (
      this.user.password !== undefined && this.user.password.trim().length > 0
    );
  }
  //  signup validation
  get hasValidfirstName(): boolean {
    return (
      this.user.stored.first_name !== undefined &&
      this.user.stored.first_name.trim().length > 0
    );
  }
  get hasValidlastName(): boolean {
    return (
      this.user.stored.last_name !== undefined &&
      this.user.stored.last_name.trim().length > 0
    );
  }
  get hasValidsignupEmail(): boolean {
    return (
      this.user.stored.email !== undefined &&
      this.user.stored.email.trim().length > 0
    );
  }
  get hasValidsignupPhone(): boolean {
    return (
      this.user.stored.phone !== undefined &&
      this.user.stored.phone.trim().length > 0
    );
  }
  get hasValidsignupPass(): boolean {
    return (
      this.user.password !== undefined && this.user.password.trim().length > 0
    );
  }

  get hasValidsignupTC(): boolean {
    return this.user.acceptedTermsAndCondition !== undefined;
  }

  // createrprop
  get hasValidProfileUsername(): boolean {
    return !this.user.edited.username;
  }

  get hasValidDateOfBirth(): boolean {
    return this.user.dateValue && this.user.dateValue != undefined;
  }
  get hasValidHeight(): boolean {
    return (
      this.user.stored.height.feet && this.user.stored.height.feet != undefined
    );
  }
  get hasValidWeight(): boolean {
    return this.user.edited.weight && this.user.edited.weight != undefined;
  }
  get hasValidGender(): boolean {
    return this.user.edited.gender && this.user.edited.gender != undefined;
  }
  get hasValidLocation(): boolean {
    return this.user.edited.address.city && this.user.edited.address.city != undefined;
  }
  get hasValidGymLocation(): boolean {
    
    return this.user.edited.gymAddress.address && this.user.edited.gymAddress.address != undefined;
  }

  @transaction
  initFriendList(): void {
    if (!this.friendList) this.friendList = new FriendList();
    this.friendList.reset();
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  @monitor(Monitors.Loading)
  async openChat(info: UserInfo | ChatRoom | string | Chat): Promise<void> {
    // deinit current chat before opening another one
    if (this.chat !== undefined) Reactronic.dispose(this.chat);
    if (info instanceof UserInfo) {
      this.chat = new Chat(info.chat_room_id);
      await this.chat.initChat();
    } else if (info instanceof ChatRoom) {
      this.chat = new Chat(info.chat_room_id || info.group_id);
      await this.chat.initChat();
    } else if (info instanceof Chat) {
      this.chat = info;
      await this.chat.initChat();
    } else {
      this.chat = new Chat(info);
      await this.chat.initChat();
    }
  }

  @reaction
  protected goToChat(): void {
    if (this.chat)
      // todo: get rid of setTimeout
      setTimeout(() => this.rootNavigation.push("Chat"));
  }

  @reaction
  deinitCurrentChatOnLogout(): void {
    if (!Api.isAuthenticated()) {
      if (this.chat !== undefined) {
        Reactronic.dispose(this.chat);
        this.chat = undefined;
      }
    }
  }

  openEditActivity(summary: ActivitySummary): void {
    if (summary.origin !== ActivityOrigin.TEM) {
      Alert.alert(
        "",
        "Selected activity is imported from external application. Do you want to edit it?",
        [
          { text: "No" },
          {
            text: "Yes",
            onPress: () => void this.openEditActivityInternal(summary),
          },
        ],
        { cancelable: false }
      );
    } else {
      void this.openEditActivityInternal(summary);
    }
  }

  private async openEditActivityInternal(
    summary: ActivitySummary
  ): Promise<void> {
    const model = standalone(() =>
      Transaction.run(() => new ActivityEdit(summary))
    );
    await model.setActivityPickerValue();
    App.rootNavigation.push("EditActivity", { model });
  }

  @monitor(Monitors.Loading)
  async getShareAppLinkMessage(): Promise<string> {
    const { data: link }: ApiData<string> = await Api.call(
      "GET",
      "settings/invite_link"
    );
    const message: string = `To download the TĒM App follow the link: ${link}`;
    return message;
  }

  @reaction
  protected async loadStartScreen(): Promise<void> {
    try {
      const v = await AsyncStorage.getItem(StartScreenKey);
      if (v) {
        this.startScreen = JSON.parse(v);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async saveStartScreen(value: StartScreen): Promise<void> {
    try {
      const v = JSON.stringify(value);
      await AsyncStorage.setItem(StartScreenKey, v);
    } catch (e) {
      console.log(e);
    }
  }

  async resetStartScreen(): Promise<void> {
    await AsyncStorage.removeItem(StartScreenKey);
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async openNewPost(uri?: string): Promise<void> {
    this.imageSelection.reset();
    if (uri) {
      const imagesMutable = this.imageSelection.images.toMutable();
      imagesMutable.push(uri);
      this.imageSelection.images = imagesMutable;
    } else await this.imageSelection.selectImage();
    if (this.imageSelection.images.length > 0)
      this.rootNavigation.push("NewPost");
  }

  openGoalsAndChallenges(groupId?: string): void {
    if (groupId) {
      this.goalsAndChallenges.useGroupChallengesManager(groupId);
      this.goalsAndChallenges.tabsManager.navigate(GoalFilter.Challenges);
    } else {
      this.goalsAndChallenges.useDefaultChallengesManager();
      this.goalsAndChallenges.tabsManager.navigate(GoalFilter.All);
    }
    this.rootNavigation.push("GoalsAndChallenges");
  }

  async openProfileTemates(): Promise<void> {
    await this.user.loadProfileProperties();
    this.rootNavigation.push("ProfileTemates");
  }
}

export let App: AppModel;

export function initApp(): AppModel {
  if (App === undefined)
    // ! caching App object to handle app restart during background activity tracking
    App = Transaction.run(() => new AppModel());
  return App;
}
