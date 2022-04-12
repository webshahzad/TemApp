import { Value } from "react-native-reanimated";
//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import {
  ObservableObject,
  transaction,
  monitor,
  reaction,
  reentrance,
  Reentrance,
  unobservable,
  observableArgs,
  nonreactive,
} from "reactronic";
import { ImageSourcePropType, Alert, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import { GoogleSignin } from "react-native-google-signin";
import { Address } from "../data/Address";
import UserDummy from "assets/images/user-dummy2.png";
import { Monitors } from "models/app/Monitors";
import { Api, ApiData } from "models/app/Api";
import { populate } from "common/populate";
import { UserHais } from "../data/UserHais";
import { UserReport } from "../data/UserReport";
import { UserRadar } from "../data/UserRadar";
import { UserId } from "../data/UserId";
import { BiomarkerPillar } from "../data/BiomarkerPillar";
import { Bool } from "common/constants";
import { App, AppModel } from "models/app/App";
import { UploadManager } from "models/app/FileUpload";
import { ImagePickerResponse } from "react-native-image-picker";
import { UsernameSuggest } from "models/app/UsernameSuggest";
import { Firebase } from "./Firebase";
import { ExtraHoneyCombs } from "./ExtraHoneyCombs";
import { MentalHealth } from "./MentalHealth/MentalHealth";
import { PostList } from "./PostList";
import { PagedListLoadingResponse } from "./PagedList";
import { FeedElement } from "models/data/Feed";
import { ProfileInfo } from "./UserInspector";

const UserKey = "App.user.stored";
const InterestsKey = "App.user.interests";
const FacebookQueryBaseUrl = "https://graph.facebook.com/v2.5/me?access_token=";

export enum UserVerificationTarget {
  Email = 1,
  Phone = 2,
}

interface IPercentObject {
  isUsername: boolean;
}

export enum UserProfileCompletion {
  NotDone = 0,
  CreateProfile = 1,
  SelectInterests = 2,
}

export class User extends ObservableObject {
  @unobservable private readonly app: AppModel;
  @unobservable readonly stored: StoredUser;
  @unobservable readonly edited: StoredUser;
  @unobservable readonly hais: UserHais;
  @unobservable readonly report: UserReport;
  @unobservable readonly radar: UserRadar;
  @unobservable readonly storedBiomarker: BiomarkerPillar;
  @unobservable readonly editedBiomarker: BiomarkerPillar;
  @unobservable readonly suggest: UsernameSuggest;
  @unobservable readonly extraHoneyCombs: ExtraHoneyCombs;
  @unobservable readonly posts: PostList;
  @unobservable readonly mentalHealth: MentalHealth;

  snsType?: number = undefined;
  snsID?: string = undefined;
  fbConnected?: number = undefined;
  postCount?: number = undefined;
  tematesCount?: number = undefined;
  temsCount?: number = undefined;
  pushNotificationStatus?: number = undefined;
  calenderNotificationStatus?: number = undefined;
  isFromSignUp: boolean = false;
  interest?: Array<string> = undefined;
  password?: string = undefined; // 'Tebe^007'
  password2?: string = undefined;
  otp_code?: string = undefined;
  acceptedTermsAndCondition: boolean = false;
  showDesc: boolean = false;
  showSignup: boolean = false;
  showChecklist: boolean = false;
  showReminder: boolean = false;
  showLocation: boolean = false;
  locationString: string = "";
  Recurring: boolean = false;
  Type: boolean = false;
  Temmate: boolean = false;
  Visibility: boolean = false;
  isRemember: boolean = true;
  groupName: boolean = false;
  profilePercentage: number = 0;
  groupDescription: boolean = false;
  challengeName: boolean = false;
  challengeDesc: boolean = false;
  chatType?: number = undefined;

  isTemate: boolean = false;
  isInterest: boolean = false;
  groupTĒMATES: boolean = false;
  groupInterests: boolean = false;
  isValidate: boolean = false;
  termAndCondition: boolean = false;
  checkingUpdate: boolean = false;
  afterSignUp: boolean = false;
  isJournal?: boolean = false;
  TemTv?: boolean = false;
  Nutrition?: boolean = false;
  ride?: boolean = false;
  // nutrition?: boolean= false;
  // ride?: boolean = false;
  private: boolean = false;
  public: boolean = false;
  temates: boolean = false;
  isIcon: boolean = false;
  startDate?: string = undefined;
  dateValue?: string = undefined;
  heightValue?: string = undefined;
  weightValue?: string = undefined;
  isProfilePic?: boolean = false;
  isUsername?: boolean = false;
  isDoB?: boolean = false;
  isHeight?: boolean = false;
  isWeight?: boolean = false;
  isGender?: boolean = false;
  isUserLocation?: boolean = false;
  isGymLocation?: boolean = false;
  isGymType?: boolean = false;
  profileObject?: Array<boolean> = undefined;
  challengePrivacy: string = "";
  dialogText: string = "";
  accountabilityIndex?: number = undefined;
  tematesToAddMutable?: Array<string> = undefined;
  //goal screen
  goalType: boolean = false;
  goalName: boolean = false;
  goalDescription: boolean = false;
  goalStartDate: boolean = false;
  goalDuration: boolean = false;
  goalActivitySelection: boolean = false;
  goalActivity: boolean = false;
  goalTēm1: boolean = false;
  goalTēm2: boolean = false;
  goalTēmates: boolean = false;
  goalMatric: boolean = false;
  valueMetric?: string = undefined;

  // challenge screen
  challengeType: boolean = true;
  challengeTypeValue?: string = undefined;
  metricDrawer: boolean = false;
  // ActivityLog
  PhysicalFitness: boolean = true;
  NutritionAwareness: boolean = false;
  Sports: boolean = false;
  Lifestyle: boolean = false;
  MentalStrength: boolean = false;
  isActivity: boolean = true;
  isFundrising: boolean = false;
  hidden: boolean = false;
  day: any = null;
  AccountabilityModel: boolean = false;
  //groupinfo
  isFocused: boolean = false;
  
  constructor(app: AppModel) {
    super();
    this.app = app;
    this.stored = new StoredUser();
    this.edited = new StoredUser();
    this.hais = new UserHais();
    this.report = new UserReport();
    this.radar = new UserRadar();
    this.storedBiomarker = new BiomarkerPillar();
    this.editedBiomarker = new BiomarkerPillar();
    this.suggest = new UsernameSuggest();
    this.extraHoneyCombs = new ExtraHoneyCombs();
    // To invalidate this.loadUserPosts cache on page reload, Date.now() is passed as `time` argument.
    this.posts = new PostList((page) => this.loadUserPosts(page, Date.now()));
    this.mentalHealth = new MentalHealth();
  }

  get id(): string {
    return this.stored._id;
  }

  getAvatar(): ImageSourcePropType {
    let result: ImageSourcePropType;
    if (this.stored.profile_pic) result = { uri: this.stored.profile_pic };
    else result = UserDummy;
    return result;
  }

  getFullName(): string {
    return this.stored.getFullName();
  }

  getUserId(): UserId {
    const result = new UserId();
    result._id = this.stored._id;
    result.first_name = this.stored.first_name;
    result.last_name = this.stored.last_name;
    result.profile_pic = this.stored.profile_pic;
    result.username = this.stored.username;
    return result;
  }
  @reaction
  showIcon(): void {
    let regex =
      /^(?:[A-Z\d][A-Z\d_-]{5,10}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i;
    let validEmail = regex.test(this.stored.username);
    if (this.stored.username?.length > 2) {
      this.isValidate = true;
      this.isIcon = true;
    } else {
      this.isValidate = false;
      this.isIcon = false;
    }
  }
  @reaction
  profilePicPercent(): void {
    if (this.edited.newProfilePicImage?.uri && this.isProfilePic === false) {
      this.isProfilePic = true;
      this.profilePercentage = this.profilePercentage + 12.5;
    } else if (
      !this.edited.newProfilePicImage?.uri &&
      this.isProfilePic === true
    ) {
      this.isProfilePic = false;
      this.profilePercentage = this.profilePercentage - 12.5;
    }
  }
  @reaction
  usernamePercent(): void {
    if (this.edited.username?.trim().length > 2 && this.isUsername === false) {
      this.isUsername = true;
      this.profilePercentage = this.profilePercentage + 12.5;
    } else if (
      this.edited.username?.trim().length < 2 &&
      this.isUsername === true
    ) {
      this.isUsername = false;
      this.profilePercentage = this.profilePercentage - 12.5;
    }
  }
  @reaction
  DoBPercent(): void {
    if (this.dateValue && this.isDoB === false) {
      this.isDoB = true;
      this.profilePercentage = this.profilePercentage + 12.5;
    } else if (!this.dateValue && this.isDoB === true) {
      this.isDoB = false;
      this.profilePercentage = this.profilePercentage - 12.5;
    }
  }
  @reaction
  heightPercent(): void {
    if (this.edited.height.feet && this.isHeight === false) {
      this.isHeight = true;
      this.profilePercentage = this.profilePercentage + 12.5;
    } else if (!this.edited.height.feet && this.isHeight === true) {
      this.isHeight = false;
      this.profilePercentage = this.profilePercentage - 12.5;
    }
  }
  @reaction
  weightPercent(): void {
    if (this.edited.weight && this.isWeight === false) {
      this.isWeight = true;
      this.profilePercentage = this.profilePercentage + 12.5;
    } else if (!this.edited.weight && this.isWeight === true) {
      this.isWeight = false;
      this.profilePercentage = this.profilePercentage - 12.5;
    }
  }
  @reaction
  genderPercent(): void {
    if (this.edited.gender && this.isGender === false) {
      this.isGender = true;
      this.profilePercentage = this.profilePercentage + 12.5;
    } else if (!this.edited.gender && this.isGender === true) {
      this.isGender = false;
      this.profilePercentage = this.profilePercentage - 12.5;
    }
  }
  @reaction
  userAddressPercent(): void {
    if (this.edited.address.city && this.isUserLocation === false) {
      this.isUserLocation = true;
      this.profilePercentage = this.profilePercentage + 12.5;
    } else if (!this.edited.address.city && this.isUserLocation === true) {
      this.isUserLocation = false;
      this.profilePercentage = this.profilePercentage - 12.5;
    }
  }
  @reaction
  gymAddressPercent(): void {
    if (this.edited.gymAddress.address && this.isGymLocation === false) {
      this.isGymLocation = true;
      this.profilePercentage = this.profilePercentage + 12.5;
    } else if (!this.edited.gymAddress.address && this.isGymLocation === true) {
      this.isGymLocation = false;
      this.profilePercentage = this.profilePercentage - 12.5;
    }
  }

  @reaction
  protected async saveUserInfoToFirestore(): Promise<void> {
    if (this.id) {
      const data = {
        email: this.stored.email,
        first_name: this.stored.first_name,
        last_name: this.stored.last_name,
        profile_pic: this.stored.profile_pic,
        user_id: this.id,
      };
      await Firebase.users.doc(this.id).set(data);
    }
  }
  @reaction
  iconShow(): void {
    if (App.user.stored.username?.trim().length > 3) {
      this.isIcon = true;
    } else if (App.user.stored.username?.trim().length < 3) {
      this.isIcon = false;
    }
  }

  @transaction
  groupNameCheck(): void {
    if (App?.social.createGroup.name.trim().length > 2) {
      this.groupName = true;
    } else if (App?.social.createGroup.name.trim().length < 2) {
      this.groupName = false;
    }
  }
  @transaction
  groupDescCheck(): void {
    if (App?.social.createGroup.description.trim().length > 2) {
      this.groupDescription = true;
    } else if (App?.social.createGroup.description.trim().length < 2) {
      this.groupDescription = false;
    }
  }
  // createChallenge checkbox handle
  @transaction
  challengeTypeCheck(): void {
    if (App?.social.createGroup.name.trim().length > 2) {
      this.groupName = true;
    } else if (App?.social.createGroup.name.trim().length < 2) {
      this.groupName = false;
    }
  }

  //editchallenge checkbox handle
  @transaction
  challengeNameCheck(item: any): void {
    if (item.value.trim().length > 0) {
      this.challengeName = true;
    } else if (item.value.trim().length < 2) {
      this.challengeName = false;
    }
  }

  @transaction
  challengeDescCheck(item: any): void {
    if (item.value.trim().length > 0) {
      this.challengeDesc = true;
    } else if (item.value.trim().length < 2) {
      this.challengeDesc = false;
    }
  }
  @transaction
  @monitor(Monitors.Loading)
  async signUp(): Promise<void> {
    const phone = this.stored.phone;
    const countryCode = this.stored.country_code;
    if (phone && !phone.startsWith("+")) this.stored.phone = `${phone}`;
    const response: ApiData<{ token?: string }> = await Api.call(
      "POST",
      "signup",
      {
        first_name: this.stored.first_name,
        last_name: this.stored.last_name,
        email: this.stored.email,
        password: this.password,
        phone: this.stored.phone,
        country_code: this.stored.country_code,
      }
    );
    console.log(
      "dataa",
      this.stored.first_name,
      this.stored.last_name,
      this.stored.email,
      this.password,
      this.stored.phone,
      this.stored.country_code
    );
    console.log("sigupResponse", response);
    this.afterSignUp = true;
  }

  @transaction
  @monitor(Monitors.Loading)
  async verifySignUpCode(): Promise<void> {
    const response: ApiData<{ token?: string }> = await Api.call(
      "PUT",
      "signup/otp_verify",
      {
        username: this.stored.email || this.stored.phone,
        otp_code: this.otp_code,
      }
    );
    populate(this.stored, response.data);
    Api.setAuthToken(response.data.token);
    this.afterSignUp = false;
    this.otp_code = undefined; // clear OTP code
  }

  @transaction
  @monitor(Monitors.Loading)
  async requestEmailVerification(email: string): Promise<void> {
    await Api.call("PUT", "profile/email_phone", {
      type: UserVerificationTarget.Email,
      email,
    });
  }

  @transaction
  @monitor(Monitors.Loading)
  async requestPhoneVerification(
    countryCode: string,
    phone: string
  ): Promise<void> {
    await Api.call("PUT", "profile/email_phone", {
      type: UserVerificationTarget.Phone,
      country_code: countryCode,
      phone,
    });
  }

  @transaction
  @monitor(Monitors.Loading)
  async verifyEmail(): Promise<void> {
    const response: ApiData<{ token?: string }> = await Api.call(
      "PUT",
      "profile/verify_otp",
      {
        otp_code: this.otp_code,
        type: UserVerificationTarget.Email,
      }
    );
    this.stored.email = (response.data as any).email;
    this.otp_code = undefined; // clear OTP code
    Alert.alert("", response.message);
  }

  @transaction
  @monitor(Monitors.Loading)
  async verifyPhone(): Promise<void> {
    const response: ApiData<{ token?: string }> = await Api.call(
      "PUT",
      "profile/verify_otp",
      {
        otp_code: this.otp_code,
        type: UserVerificationTarget.Phone,
      }
    );

    const data = response.data as any;
    this.stored.phone = data.phone;
    this.stored.country_code = data.country_code || "";

    this.otp_code = undefined; // clear OTP code
    Alert.alert("", response.message);
  }

  @transaction
  @monitor(Monitors.Loading)
  async login(): Promise<void> {
    return this.loginUser({
      sns_type: UserType.Tem,
      username: this.stored.username,
      password: this.password,
      activate: true,
    });
  }

  @transaction
  async loginFacebook(): Promise<UserProfileCompletion | null> {
    let result: UserProfileCompletion | null = null;
    try {
      const loginResult = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      if (!loginResult.isCancelled) {
        const tokenInfo = await AccessToken.getCurrentAccessToken();
        if (!tokenInfo) {
          console.log("Failed to receive Facebook token");
        } else {
          const token = tokenInfo.accessToken;
          const response = await fetch(
            `${FacebookQueryBaseUrl}${token}&fields=email,first_name,last_name`
          );
          const userInfo = await response.json();
          await this.loginUser({
            sns_type: UserType.Facebook,
            sns_id: userInfo.id,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            is_email_verified: Bool.True,
            activate: true,
          });
          if (this.stored.profile_completion_status !== undefined)
            result = this.stored.profile_completion_status;
        }
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  @transaction
  async loginGoogle(): Promise<UserProfileCompletion | null> {
    let result: UserProfileCompletion | null = null;
    try {
      const userInfo = await GoogleSignin.signIn();
      const user = userInfo.user;
      await this.loginUser({
        sns_type: UserType.Google,
        sns_id: user.id,
        first_name: user.givenName,
        last_name: user.familyName,
        email: user.email,
        is_email_verified: Bool.True,
        activate: true,
      });
      if (this.stored.profile_completion_status !== undefined)
        result = this.stored.profile_completion_status;
    } catch (e) {
      console.log(e);
      Alert.alert("Sign-in error", e.message);
    }
    return result;
  }

  private async loginUser(userInfo: any): Promise<void> {
    const response: ApiData<{ token?: string }> = await Api.call(
      "POST",
      "login",
      userInfo
    );
    this.password = undefined; // clear password
    populate(this.stored, response.data);
    populate(this, response.data, ["interest"]);
    Api.setAuthToken(response.data.token);

    response.data.token && AsyncStorage.setItem("token", response.data.token);
  }

  async updateProfileCompletionStatus(
    status: UserProfileCompletion
  ): Promise<void> {
    await Api.call("PUT", "users/profile_status", { status });
  }
  @transaction
  async loadChatList(): Promise<void> {
    const response = await Api.call<ApiData<ProfileInfo>>(
      "GET",
      "profile/my_profile/1"
    );
  }
  @transaction
  async loadProfileProperties(): Promise<void> {
    const response = await Api.call<ApiData<ProfileInfo>>(
      "GET",
      "profile/my_profile/1"
    );

    const profile = response.data.user;
    // console.log("profile", JSON.stringify(profile, null, 2));
    this.stored.accountabilityMission = profile.accountabilityMission;
    this.stored.activityScore = profile.activityCount?.score;
    this.stored.profileComplition = profile.last_name;
    populate(this.stored.address, profile.address);
    populate(this.stored.gymAddress, profile.gym);
    const posts = response.data.posts.map((info: any) => {
      const post = new FeedElement();
      populate(post, info);
      populate(post.user, this.stored);
      return post;
    });
    this.posts.setPosts(posts, 1);
  }

  // @monitor makes this method cached, @sensitiveArgs makes it rely on arguments.
  // To make it possible to reload posts on 1st page, `time` argument is passed
  // to invalidate cache on each call.
  @monitor(Monitors.UserPostsRefreshing)
  @observableArgs(true)
  private async loadUserPosts(
    page: number,
    time: number
  ): Promise<PagedListLoadingResponse<FeedElement>> {
    const response = await Api.call<ApiData<ProfileInfo | FeedElement[]>>(
      "GET",
      `profile/my_profile/${page}`
    );
    const newPosts =
      response.data instanceof Array ? response.data : response.data.posts;
    const posts = newPosts.map((info: any) => {
      const post = new FeedElement();
      populate(post, info);
      populate(post.user, this.stored);
      return post;
    });
    return {
      items: posts,
    };
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async reset(): Promise<boolean> {
    let result = false;
    if (this.stored.token) {
      await AsyncStorage.removeItem(UserKey);
      this.stored.reset();
      this.password = undefined;
      this.password2 = undefined;
      result = true;
    }
    return result;
  }

  @transaction
  @monitor(Monitors.Loading)
  async logout(): Promise<void> {
    try {
      await Api.call("PUT", "users/logout");
    } finally {
      Api.setAuthToken(undefined);
      await this.reset();
      await this.app.googleFit.reset();
    }
  }

  @transaction
  @monitor(Monitors.Loading)
  async forgotPassword(): Promise<void> {
    const response: ApiData<{ token?: string }> = await Api.call(
      "POST",
      "forgot_password",
      {
        username: this.stored.username,
      }
    );
    ToastAndroid.show(response.message, ToastAndroid.SHORT);
  }

  @transaction
  @monitor(Monitors.Loading)
  async verifyForgotPasswordCode(): Promise<void> {
    const response: { message: string; reset_token?: string } = await Api.call(
      "POST",
      "forgot_password/otp_verify",
      {
        username: this.stored.username,
        otp_code: this.otp_code,
      }
    );
    this.stored.token = response.reset_token;
  }

  @transaction
  @monitor(Monitors.Loading)
  async resetPassword(): Promise<void> {
    const response: ApiData<{ token?: string }> = await Api.call(
      "PUT",
      "reset_password",
      {
        username: this.stored.username,
        reset_token: this.stored.token,
        password: this.password,
      }
    );
    this.stored.token = undefined;
    ToastAndroid.show(response.message, ToastAndroid.SHORT);
  }

  @reaction
  protected async saveUserDetails(): Promise<void> {
    try {
      if (this.isRemember) {
        console.log("thisIsReme", this.isRemember);
        const token = this.stored.token;
        if (token || this.afterSignUp) {
          const info = JSON.stringify(this.stored);
          await AsyncStorage.setItem(UserKey, info);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  @reaction
  protected async loadUserDetails(): Promise<void> {
    const remember = this.isRemember;

    try {
      const patch = await User.loadUserDetails();
      if (patch) populate(this.stored, patch);
    } catch (e) {
      console.log(e);
    }

    Api.setAuthToken(nonreactive(() => this.stored.token));
  }

  static async loadUserDetails(): Promise<StoredUser | undefined> {
    const info = await AsyncStorage.getItem(UserKey);
    if (info) return JSON.parse(info);
    return undefined;
  }

  @reaction
  protected async saveInterests(): Promise<void> {
    try {
      if (this.interest) {
        const interests = JSON.stringify(this.interest);
        await AsyncStorage.setItem(InterestsKey, interests);
      }
    } catch (e) {
      console.log(e);
    }
  }

  @reaction
  protected async loadInterests(): Promise<void> {
    try {
      const interests = await AsyncStorage.getItem(InterestsKey);
      if (interests) {
        populate(this, { interest: JSON.parse(interests) }, ["interest"]);
      }
    } catch (e) {
      console.log(e);
    }
    Api.setAuthToken(nonreactive(() => this.stored.token));
  }

  @reaction
  protected initEditedUser(): void {
    populate(this.edited, this.stored);
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  @monitor(Monitors.Loading)
  async saveProfileChanges(): Promise<void> {
    try {
      const u = this.edited;
      const userNameChanged = u.username !== this.stored.username;
      const profile: any = {
        dob: u.dateOfBirth,
        gender: u.gender,
        username: userNameChanged ? u.username : "",
        profile_completion_percentage: this.getFilledPercentage(u),
        first_name: u.first_name,
        last_name: u.last_name,
        weight: u.weight,
        feet: u.height?.feet,
        inch: u.height?.inch,
        address: u.address,
        gym: u.gymAddress,
      };
      console.log("profileData", profile);
      let newProfilePic: string | undefined = undefined;
      if (u.newProfilePicImage) {
        newProfilePic = await UploadManager.uploadPickerImage(
          u.newProfilePicImage
        );
        if (newProfilePic) {
          profile.profile_pic = newProfilePic; // update user on API
          u.profile_pic = newProfilePic; // update local user.edited
        }
      }
      await Api.call("PUT", "profile", profile);
      populate(this.stored, u);
    } catch (e) {
      console.log("profileError", e);
      Alert.alert("error");
    }
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  @monitor(Monitors.Loading)
  async saveMandatoryProfileChanges(): Promise<void> {
    try {
      const u = this.edited;
      const profile: any = {
        dob: u.dateOfBirth,
        weight: u.weight,
        profile_completion_percentage: this.getFilledPercentage(u),
        feet: u.height.feet,
        last_name: u.last_name,
        first_name: u.first_name,
        profile_pic: u.newProfilePicImage?.uri,
        username: u.username,
        address: u.address,
        inch: u.height.inch,
        gender: u.gender,
      };
      Alert.alert("hello");
      await Api.call("PUT", "profile", profile);
      populate(this.stored, u);
    } catch (e) {
      Alert.alert("hi");
      console.log(e);
    }
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  @monitor(Monitors.Loading)
  async saveAccountabilityMission(): Promise<void> {
    try {
      const u = this.edited;
      const profile = {
        profile_completion_percentage: this.getFilledPercentage(u),
        accountabilityMission: u.accountabilityMission,
      };
      await Api.call("PUT", "profile", profile);
      populate(this.stored, u, ["accountabilityMission"]);
      ToastAndroid.show("Done", ToastAndroid.SHORT);
    } catch (e) {
      console.log(e);
    }
  }

  @transaction
  cancelProfileChanges(): void {
    populate(this.edited, this.stored);
  }

  private getFilledPercentage(user: StoredUser): number {
    const fieldCount = 10;
    let overallCompletionFieldsCount = 0.0;
    if (user.profile_pic) {
      overallCompletionFieldsCount += 1.0;
    }
    if (user.username) {
      overallCompletionFieldsCount += 1.0;
    }
    if (user.dateOfBirth) {
      overallCompletionFieldsCount += 1.0;
    }
    if (user.height?.feet !== undefined && user.height.feet > 0) {
      overallCompletionFieldsCount += 1.0;
    }
    if (user.weight !== undefined && user.weight > 0) {
      overallCompletionFieldsCount += 1.0;
    }
    if (user.gender !== undefined && user.gender !== 0) {
      overallCompletionFieldsCount += 1.0;
    }
    // if self.regiseterUser.address?.formatted != nil && self.regiseterUser.address?.formatted != ""{
    //     overallCompletionFieldsCount += 1.0
    // }
    // if (self.regiseterUser.gymAddress != nil && self.regiseterUser.gymAddress?.name != nil){
    //     if(!(self.regiseterUser.gymAddress?.name!.isBlank)!){
    //         overallCompletionFieldsCount += 1.0
    //     }
    // }
    if (this.stored.first_name && this.stored.first_name.length >= 2) {
      overallCompletionFieldsCount += 1.0;
    }
    if (this.stored.last_name && this.stored.last_name.length >= 2) {
      overallCompletionFieldsCount += 1.0;
    }
    if (this.stored.email) {
      overallCompletionFieldsCount += 1.0;
    }
    if (this.stored.phone) {
      overallCompletionFieldsCount += 1.0;
    }

    // //FIXME: Add gym calculation here
    // print("total filled fields *********** : \(overallCompletionFieldsCount)")
    // if isProfileDashboardView {
    //     lastFilledPercent = overallCompletionFieldsCount / 10.0
    //     return Float(overallCompletionFieldsCount/10.0)

    // }
    // lastFilledPercent = overallCompletionFieldsCount / 12.0
    // return Float(overallCompletionFieldsCount/12.0)

    return (overallCompletionFieldsCount / fieldCount) * 100;
  }

  @reaction
  protected async loadBiomarker(): Promise<void> {
    if (Api.isAuthenticated()) {
      try {
        const response = await Api.call<ApiData>(
          "GET",
          "users/getBiomarkerPillar"
        );
        const data = (response.data as any).biomarker_pillar;
        populate(this.storedBiomarker, data);
      } catch (e) {
        console.log(e);
      }
    }
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  @monitor(Monitors.Loading)
  async saveBiomarkerChanges(): Promise<void> {
    const u = this.edited;
    try {
      const body = {
        ...this.editedBiomarker,
        feet: u.height.feet,
        inch: u.height.inch,
        weight: u.weight,
      };
      await Api.call("POST", "users/addBiomarkerPillar", body);
      populate(this.storedBiomarker, this.editedBiomarker);
      populate(this.stored, u, ["height", "weight"]);
    } catch (e) {
      console.log(e);
    }
  }

  @transaction
  cancelBiomarkerChanges(): void {
    populate(this.editedBiomarker, this.storedBiomarker);
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async savePushNotifications(): Promise<void> {
    try {
      const response = await Api.call<ApiData>(
        "POST",
        "users/pushNotificationToggle",
        {
          _id: this.stored._id,
          push_notification: this.edited.push_notification,
          calender_notification: this.edited.calender_notification,
        }
      );
      this.stored.push_notification = this.edited.push_notification;
      if (response.data) {
        const status = response.data as string;
        if (status) {
          if (status.includes("Calendar Notifications Stopped")) {
            this.stored.calender_notification =
              this.edited.calender_notification = Bool.False;
          } else if (status.includes("Calendar Notifications Started")) {
            this.stored.calender_notification =
              this.edited.calender_notification = Bool.True;
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async saveCalendarNotifications(): Promise<void> {
    try {
      await Api.call("POST", "users/calendarNotificationToggle", {
        _id: this.stored._id,
        calender_notification: this.edited.calender_notification,
      });
      this.stored.calender_notification = this.edited.calender_notification;
    } catch (e) {
      console.log(e);
    }
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async disable(): Promise<void> {
    try {
      await Api.call("POST", "users/changeAccountStatus");
      await AsyncStorage.removeItem(UserKey);
      this.app.rootNavigation.replace("LogIn");
    } catch (e) {
      console.log(e);
    }
  }

  @reaction
  protected async loadUsernameSuggestions(): Promise<void> {
    if (Api.isAuthenticated()) {
      try {
        if (
          this.stored.username ||
          this.stored.email ||
          this.stored.first_name
        ) {
          // for subscription
          await this.suggest.loadSuggestions();
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  @transaction
  async setIsPrivate(value: boolean): Promise<void> {
    try {
      const isPrivate = value ? Bool.True : Bool.False;
      await Api.call("POST", "users/privateUser", {
        id: this.stored._id,
        is_private: isPrivate,
      });
      this.stored.is_private = isPrivate;
    } catch (e) {
      console.log(e);
    }
  }

  @transaction
  async updateFilledPercentage(): Promise<void> {
    try {
      await Api.call("PUT", "profile", {
        profile_completion_percentage: this.getFilledPercentage(this.stored),
      });
    } catch (e) {
      console.log(e);
    }
  }

  @reaction
  protected async sendUserInfoToAccessory(): Promise<void> {
    if (this.app.accessory.selectedPeer) {
      await this.app.accessory.sendMessage(this.app.accessory.selectedPeer, {
        type: "user-info",
        data: {
          firstName: this.stored.first_name,
          lastName: this.stored.last_name,
          weight: this.stored.weight,
          gender: this.stored.gender,
        },
      });
    }
  }
}

export enum UserType {
  Tem = 1,
  Facebook = 2,
  Google = 3,
  Ios = 4,
}

class Height extends ObservableObject {
  feet?: number = undefined;
  inch?: number = undefined;
}

export class StoredUser extends ObservableObject {
  deviceType?: string = undefined;
  deviceToken?: string = undefined;
  token?: string = undefined;
  firebaseProfileImageName?: string = undefined;
  deviceId?: string = undefined;
  email?: string = undefined;
  _id: string = "";
  first_name: string = "";
  last_name: string = "";
  phone?: string = undefined;
  profile_pic?: string = undefined;
  dateOfBirth?: string = undefined;
  address: Address = new Address();
  gymAddress: Address = new Address();
  country_code?: string = undefined;
  deviceID?: string = undefined;
  is_private?: number = undefined;
  push_notification?: number = undefined;
  calender_notification?: number = undefined;
  status?: number = undefined;
  username?: string = undefined;
  verified_status?: number = undefined;
  gender?: Gender = undefined;
  height: Height = new Height();
  location?: string = undefined;
  weight?: number = undefined;
  createdAt?: string = undefined;
  profile_completion_status?: UserProfileCompletion =
    UserProfileCompletion.NotDone;
  socialMedia: Array<Parameters> = [];
  chatData: Array<Parameters> = [];
  valueData: number = 1;
  chatType?: number = undefined;
  MessageBtnBg: string = "#0B82DC";
  TemBtnBg: string = "";
  MessageBtnColor: string = "#fff";
  TemBtnColor: string = "";
  isGroupChat: boolean = false;
  trackerStatus?: number = undefined;
  tracker?: number = undefined;
  accountabilityMission?: string = undefined;
  activityScore?: number = undefined;
  unreadNotiCount: number = 0;
  isCompanyAccount: Bool = Bool.False;
  newProfilePicImage?: ImagePickerResponse = undefined;
  isInvalid: boolean = false;
  update: boolean = false;
  profileComplition?: string = undefined;

  getAvatar(): ImageSourcePropType {
    let result: ImageSourcePropType;
    if (this.newProfilePicImage && this.newProfilePicImage.uri)
      result = { uri: this.newProfilePicImage.uri };
    else if (this.profile_pic) result = { uri: this.profile_pic };
    else result = UserDummy;
    // console.log("result11", result);

    return result;
  }

  getFullName(): string {
    return this.first_name + " " + this.last_name;
  }

  @transaction
  reset(): void {
    this.deviceType = undefined;
    this.deviceToken = undefined;
    this.token = undefined;
    this.firebaseProfileImageName = undefined;
    this.deviceId = undefined;
    this.email = undefined;
    this._id = "";
    this.first_name = "";
    this.last_name = "";
    this.phone = undefined;
    this.profile_pic = undefined;
    this.dateOfBirth = undefined;
    this.address = new Address();
    this.gymAddress = new Address();
    this.country_code = "";
    this.deviceID = undefined;
    this.is_private = undefined;
    this.push_notification = undefined;
    this.calender_notification = undefined;
    this.status = undefined;
    this.username = undefined;
    this.location = undefined;
    this.verified_status = undefined;
    this.gender = undefined;
    this.height = new Height();
    this.weight = undefined;
    this.createdAt = undefined;
    this.profile_completion_status = UserProfileCompletion.NotDone;
    this.socialMedia = [];
    this.trackerStatus = undefined;
    this.tracker = undefined;
    this.accountabilityMission = undefined;
    this.activityScore = undefined;
    this.unreadNotiCount = 0;
    this.newProfilePicImage = undefined;
  }

  get hasUpdate(): boolean {
    return this.update !== undefined && !this.update;
  }
  get hasValidProfileUsername(): boolean {
    return this.username !== undefined && this.username.trim().length > 0;
  }
  get hasValidDateOfBirth(): boolean {
    return this.dateOfBirth != undefined;
  }
  get hasValidHeight(): boolean {
    return this.height != undefined;
  }
  get hasValidWeight(): boolean {
    return this.weight != undefined;
  }
  get hasValidGender(): boolean {
    return this.gender != undefined;
  }
  get hasValidLocation(): boolean {
    return this.location != undefined;
  }
  get hasValidGymLocation(): boolean {
    return this.gymAddress.address != undefined;
  }
  // get hasValidGymType(): boolean {
  //   return this.gymAddress.gymType?.owner?.type != undefined ;
  // }

  @transaction
  validate(): boolean {
    const isValid =
      this.hasValidProfileUsername &&
      this.hasValidDateOfBirth &&
      this.hasValidGender &&
      this.hasValidHeight &&
      this.hasValidWeight &&
      // this.hasValidLocation
      this.hasValidGymLocation;
    this.isInvalid = !isValid;
    return isValid;
  }
}
export class Parameters extends ObservableObject {
  // TBD
}

export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
}

export enum UserStatus {
  Verified = 1,
  NonVerified = 2,
}

export interface Profile {
  profile_pic?: string;
  dob?: string;
  feet?: number;
  inch?: number;
  weight?: number;
  gender?: number;
  username?: string;
  location?: string;
  profile_completion_percentage: number;
  first_name?: string;
  last_name?: string;
  accountabilityMission?: string;
  activityScore?: number;
  ProfileComplition?: number;
}

GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/userinfo.profile"],
});
