//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import {
  ObservableObject,
  transaction,
  reaction,
  nonreactive,
} from "reactronic";
import {
  ActivityScore,
  ActivityStatus,
  ActivityType,
  ChallengeMemberType,
  ChallengeType,
  GoalTarget,
  Metrics,
  GNCFundraising,
  GNCFundraisingDestination,
  GoalOrChallenge,
  ActivityTypeInList,
  ActivitySelection,
} from "./GoalOrChallenge";
import { Bool } from "common/constants";
import { ActivityData } from "./Activity";
import { TargetMetricsManager } from "models/app/TargetMetricsManager";
import { UserInfo } from "./UserInfo";
import { App } from "models/app/App";
import { doAsync } from "common/doAsync";
import { populate } from "common/populate";
import { Chat } from "models/app/Social/Chat";
import {
  GroupChatStatus,
  ChatWindowType,
  ChatType,
  ChatStatus,
  ChatRoom,
  Visibility,
} from "models/data/ChatRoom";

export class GoalChallengeDetailsModel
  extends ObservableObject
  implements
    ShowHoneycomb,
    TargetMetricsManager,
    CreateGoalOrChallengeInternal,
    CreateGoal,
    CreateChallenge
{
  _id: string = "";
  anyActivity: ActivitySelection = false;
  activityTypes: ActivityTypeInList[] = [];
  created_at: string = "";
  description: string = "";
  duration: string = "";
  durationCheck:boolean= false;
  goalActivitySelectionCheck:boolean= false;
  typeChallenge: string = "";
  endDate: number = 0;
  challengeTematesChec: boolean =false;
  is_mute: number = Bool.False; // 0 | 1
  isJoined: boolean = false;
  isOpen: boolean = false;
  // isModelOpen: boolean = false
  challengePrivacy: string = "";
  memberCount: number = 0;
  members: ActivityMember[] = [];
  membersScore: ActivityScore<UserInfo>[] = [];
  myScore: ActivityScore<UserInfo>[] = [];
  name: string = "";
  startDate: number = 0;
  status: ActivityStatus = ActivityStatus.InProgress;
  updatedAt: string = "";
  groupDetail?: ChatRoom = undefined; // if group is engaged in Goal / Challenge with Users
  visibility: Visibility = Visibility.Private;
  miles: String = "";

  fundraising?: GNCFundraising = undefined;
  fundraisingShadow: GNCFundraising = new GNCFundraising();

  doNotParticipate?: boolean = true; // for company account

  // gncType === ActivityType.Goal
  target?: GoalTarget[] = undefined;
  isPublic?: boolean = undefined;
  goalCreatedBy?: string = undefined;
  scorePercentage?: number = undefined;
  totalScore?: number = undefined;
  isPerPersonGoal: boolean = false;

  // gncType === ActivityType.Challenge
  matric?: Metrics[] = undefined; // typo in API
  challengeCreatedBy?: string = undefined;
  leader?: UserInfo | LeaderGroup = undefined;
  leaderType?: ChallengeMemberType = undefined; // TODO
  type?: ChallengeType = undefined;
  // type?: ChallengeType = undefined
  // tem?: ChatRoom[] = undefined // TODO: specify TEMs for challenge
  teams?: ActivityScore<ActivityGroup>[] = undefined; // scores for Tem vs Tem
  scoreBoard?: ActivityScore<UserInfo | ActivityGroup>[] = undefined; // scores for Users vs Tem

  // Custom
  gncType: ActivityType;
  showHoneyComb: Bool = 0;
  activityPickerValues: ActivityData[] = [];
  startDatePickerValue?: string = undefined;
  temates: UserInfo[] = [];
  tem1?: ChatRoom = undefined;
  tem2?: ChatRoom = undefined;
  myScoreInfo?: UserInfo = undefined;
  canUpdateMembersFromTemates: boolean = false; // members -> temates first
  memberScorePage: number = 0;
  isInvalid: boolean = false; // validation
  chat?: Chat = undefined;
  listItem: GoalOrChallenge | null = null;

  isFundraising: boolean = false;
  canUpdateFundraising: boolean = false;

  // TargetMetricsManager
  targetMetric?: Metrics = undefined;
  targetValue?: number = undefined;
  totalActivites: ReactNode
  

  constructor(gncType: ActivityType) {
    super();
    this.gncType = gncType;
    if (gncType === ActivityType.Goal) {
      this.target = [];
      this.isPublic = false;
    } else {
      this.matric = [];
      this.type = ChallengeType.UserVsUser;
    }
    this.chat = undefined;
  }

  getTypeName(): string {
    return this.anyActivity
      ? "Any activity"
      : this.activityTypes.map((t) => t.activityName).join(", ");
  }

  //#region Validation

  get hasValidName(): boolean {
    return this.name.trim().length > 0;
  }

  get hasValidStartDate(): boolean {
    return App.user.startDate?.length > 0;
  }

  get hasValidDuration(): boolean {
    return this.duration.length > 0;
  }

  get hasValidActivities(): boolean {
    return this.anyActivity === true || this.activityTypes.length > 0;
  }

  get hasValidTarget(): boolean {
    let result: boolean;
    if (this.gncType === ActivityType.Goal)
      result = (this.target?.length ?? 0) > 0;
    // ActivityType.Challenge
    else result = (this.matric?.length ?? 0) > 0;
    return result;
  }

  get hasValidMembers(): boolean {
    const isCompanyAccount: boolean =
      App.user.stored.isCompanyAccount == Bool.True;
    console.log(
      "this.challngeType",
      typeof this.type,
      typeof ChallengeType.UserVsUser
    );
    return (
      this.gncType !== ActivityType.Challenge ||
      (this.type === ChallengeType.UserVsUser &&
        (isCompanyAccount ||
          this.members.length > 0 ||
          this.groupDetail !== undefined)) ||
      (this.type === ChallengeType.UserVsTeam &&
        this.groupDetail !== undefined) ||
      this.type === ChallengeType.TeamVsTeam
    );
  }

  get hasValidTem1(): boolean {
    return (
      this.gncType !== ActivityType.Challenge ||
      this.type !== ChallengeType.TeamVsTeam ||
      this.tem1 !== undefined
    );
  }

  get hasValidTem2(): boolean {
    return (
      this.gncType !== ActivityType.Challenge ||
      this.type !== ChallengeType.TeamVsTeam ||
      this.tem2 !== undefined
    );
  }

  get hasValidTemsPair(): boolean {
    return (
      this.tem1 === undefined ||
      this.tem2 === undefined ||
      this.tem1.group_id !== this.tem2.group_id
    );
  }

  get hasValidFundsDestination(): boolean {
    return (
      !this.isFundraising || this.fundraisingShadow.destination !== undefined
    );
  }

  get hasValidFundsAmount(): boolean {
    return (
      !this.isFundraising ||
      (this.fundraisingShadow.goalAmount !== undefined &&
        this.fundraisingShadow.goalAmount > 0)
    );
  }
  @reaction
challengeDurationCheck(item:any): void {
  if (this.duration.trim().length > 2) {
    this.durationCheck = true;
  } else if (this.duration.trim().length < 2) {
    this.durationCheck = false;
  }
}
@reaction
challengeActivitySelectionChec(): void {
  if (this.activityTypes.length > 0) {
    this.goalActivitySelectionCheck = true;
  } else if (this.activityTypes.length < 0) {
    this.goalActivitySelectionCheck = false;
  }
}


@reaction
challengeTematesGroupChec(): void {
  if (this.tematesString.length > 0) {
    this.challengeTematesChec = true;
  } else if (this.tematesString.length < 0) {
    this.challengeTematesChec = false;
  }
}

  @transaction
  validate(): boolean {
    const isValid: boolean = (this.hasValidName && this.hasValidStartDate
      && this.hasValidDuration && this.hasValidActivities
      && this.hasValidTarget
      // && this.hasValidMembers
      // && this.hasValidTem1 && this.hasValidTem2
      // && this.hasValidTemsPair
      )
    this.isInvalid = !isValid
    return isValid
  }

  //#endregion

  get tematesString(): string {
    let result: string;
    if (this.groupDetail !== undefined) {
      const l = this.temates.length;
      result =
        this.groupDetail.group_title +
        (l > 0
          ? ` and ${this.temates.length} temate` + (l > 1 ? "s" : "")
          : "");
    } else result = this.temates.map((t) => t.getFullName()).join(", ");
    return result;
  }

  get tem1String(): string {
    return this.tem1?.group_title ?? "";
  }

  get tem2String(): string {
    return this.tem2?.group_title ?? "";
  }

  get canBeOpenToPublic(): boolean {
    return (
      this.gncType !== ActivityType.Challenge ||
      this.type === ChallengeType.UserVsUser
    );
  }

  needToLoadMoreMemberScore(): boolean {
    return this.membersScore.length < this.memberCount;
  }

  @transaction
  setTarget(m: Metrics, v: number): void {
    this.targetMetric = m;
    this.targetValue = v;
  }

  @transaction
  switchMetric(metric: Metrics): void {
    if (this.matric !== undefined) {
      this.matric = this.matric.toMutable();
      const i = this.matric.indexOf(metric);
      if (i !== -1) this.matric.splice(i, 1);
      else this.matric.push(metric);
    }
  }

  @transaction
  switchAllMetrics(metrics: Metrics[]): void {
    if (this.matric !== undefined) {
      if (this.matric.length === metrics.length) this.matric = [];
      else this.matric = metrics.slice();
    }
  }

  @reaction
  protected updateTarget(): void {
    if (
      this.target !== undefined &&
      this.targetMetric !== undefined &&
      this.targetValue !== undefined
    ) {
      this.target = [
        {
          matric: this.targetMetric,
          value: this.targetValue,
        },
      ];
      if (this.targetMetric === Metrics.TotalActivityTime) {
        // translate minutes to seconds
        this.target[0].value *= 60;
      }
    }
  }

  @reaction
  protected setGoalTarget(): void {
    const target = this.target;
    if (target !== undefined && target.length > 0) {
      this.targetMetric = target[0].matric;
      this.targetValue = target[0].value;
      if (this.targetMetric == Metrics.TotalActivityTime) {
        // translate seconds to minutes
        this.targetValue /= 60;
      }
    }
  }

  private canPickActivities: boolean = false;

  @reaction
  protected pickActivity(): void {
    if (this.canPickActivities) {
      const pickerValue = this.activityPickerValues;
      if (!this.hasSameActivities()) {
        this.activityTypes = pickerValue.map((v) => ({
          type: v.id,
          activityName: v.name,
          logo: v.image,
        }));
      }
    }
  }

  private hasSameActivities(): boolean {
    let result = this.activityPickerValues.length === this.activityTypes.length;
    if (result) {
      const pickerValue = this.activityPickerValues
        .map((x) => x.id)
        .toMutable()
        .sort((a, b) => a - b);
      const dataValue = this.activityTypes
        .slice()
        .sort((a, b) => a.type - b.type);
      result = pickerValue.every((id, i) => id === dataValue[i].type);
    }
    return result;
  }

  // >>>>> ASYNC reaction

  @reaction
  setActivityPickerValue(): void {
    doAsync(async () => {
      const activityTypes = this.activityTypes;
      if (App.activityManager.needToLoadActivityListForGoals)
        await App.activityManager.loadActivityListForGoals();
      if (!this.hasSameActivities()) {
        const v = activityTypes
          .map((t) =>
            App.activityManager.activityListForGoals.find(
              (a) => a.id === t.type
            )
          )
          .filter((x) => x !== undefined) as ActivityData[];
        this.activityPickerValues = v;
      }
      this.canPickActivities = true;
    });
  }

  @reaction
  protected pickStartDate(): void {
    const pickerValue = this.startDatePickerValue;
    if (pickerValue) {
      const date = new Date(pickerValue);
      date.setMilliseconds(0);
      date.setSeconds(0);
      date.setMinutes(0);
      date.setHours(0);
      this.startDate = date.valueOf();
    }
  }

  @reaction
  protected setStartDatePickerValue(): void {
    const startDate = this.startDate;
    if (startDate !== 0)
      this.startDatePickerValue = new Date(startDate).toString();
  }

  @reaction
  protected pickMembers(): void {
    const temates = this.temates;
    if (this.canUpdateMembersFromTemates && this.wasMembersUpdated()) {
      this.members = temates.map(
        (t) =>
          ({
            userInfo: t,
            id: t._id,
            inviteAccepted: 0,
            memberType: ActivityMemberType.Temate,
          } as ActivityMember)
      );
    }
  }

  @reaction
  protected setTemates(): void {
    const members = this.members.filter(
      (m) =>
        m.id !== App.user.stored._id &&
        m.memberType === ActivityMemberType.Temate
    );
    if (this.wasMembersUpdated()) {
      this.temates = members.map((m) =>
        populate(new UserInfo(), {
          ...m.userInfo,
          _id: m.id,
        } as UserInfo)
      );
    }
    this.canUpdateMembersFromTemates = true;
  }

  @reaction
  protected updateMyScoreInfo(): void {
    if (this.gncType === ActivityType.Challenge) {
      const myScore = this.myScore[0];
      let myScoreInfo: UserInfo | undefined = myScore.userInfo;
      if (myScoreInfo == undefined) {
        myScoreInfo = new UserInfo();
        myScoreInfo._id = App.user.stored._id;
        myScoreInfo.first_name = App.user.stored.first_name;
        myScoreInfo.last_name = App.user.stored.last_name;
        myScoreInfo.profile_pic = App.user.stored.profile_pic;
      }
      myScoreInfo.rank = myScore.rank;
      this.myScoreInfo = myScoreInfo;
    }
  }

  @reaction
  protected pickFundraisingFlag(): void {
    if (!this.canUpdateFundraising) {
      if (this.fundraising) {
        this.isFundraising = true;
        this.fundraisingShadow = this.fundraising;
      }
      this.canUpdateFundraising = true;
    }
  }

  @reaction
  protected updateFundraising(): void {
    if (this.canUpdateFundraising) {
      if (this.isFundraising) {
        this.fundraising = this.fundraisingShadow;
      } else {
        this.fundraisingShadow = this.fundraising ?? this.fundraisingShadow;
        this.fundraising = undefined;
      }
    }
  }
  
  private wasMembersUpdated(): boolean {
    return nonreactive(() => {
      let updated: boolean = this.members.length !== this.temates.length;
      for (let i = 0; !updated && i < this.members.length; i++) {
        updated = this.members[i].id !== this.temates[i]._id;
      }
      return updated;
    });
  }

  @reaction
  protected async initChat(): Promise<void> {
    if (this._id) {
      const isChallenge = this.gncType === ActivityType.Challenge;
      const chatWindowType = isChallenge
        ? ChatWindowType.Challenge
        : ChatWindowType.Goal;
      const chat = new Chat(this._id, chatWindowType);
      await chat.initChat();
      chat.chatWindowType = chatWindowType;
      chat.chatInfo.is_mute = this.is_mute;
      chat.chatInfo.group_chat_status = this.isJoined
        ? GroupChatStatus.Active
        : GroupChatStatus.NoLongerPartOfGroup;
      chat.chatInfo.type = ChatType.GroupChat;
      chat.chatInfo.chatWindowType = chatWindowType;
      chat.chatInfo.memberIds = this.members.map((m) => m.userId!);
      chat.chatInfo.group_title = this.name;
      chat.chatInfo.chat_status = ChatStatus.Active;
      this.chat = chat;
      console.log("chat----->",chat)
    }
  }

  getDto(): CreateGoalOrChallenge & CreateChallenge & CreateGoal {
    const doNotParticipate: boolean | undefined =
      App.user.stored.isCompanyAccount === Bool.True
        ? this.doNotParticipate
        : undefined;

    const body = {
      anyActivity: this.anyActivity,
      activityTypes: this.activityTypes.map((x) => x.type),
      description: this.description,
      duration: this.duration,
      isOpen: this.isOpen,
      members: this.members.slice(),
      name: this.name,
      type:this.type,
      startDate: this.startDate,
      doNotParticipate,
      fundraising: this.isFundraising
        ? {
            destination: this.fundraisingShadow.destination,
            goalAmount: this.fundraisingShadow.goalAmount,
          }
        : undefined,
      isPerPersonGoal: this.isPerPersonGoal,
    } as CreateGoalOrChallenge;

    const shouldUnwindGroupMembers =
      this.gncType === ActivityType.Goal ||
      this.type === ChallengeType.UserVsUser;
    if (shouldUnwindGroupMembers && this.groupDetail !== undefined) {
      const group = this.groupDetail;
      group.members.forEach((m) => {
        if (m._id !== App.user.stored._id) {
          body.members.unshift({
            id: m._id,
            groupId: group.group_id,
            inviteAccepted: 0,
            memberType: 2,
          } as ActivityMember);
        }
      });
    }

    if (this.gncType == ActivityType.Goal) {
      const g = body as CreateGoal;
      g.isPublic = this.isPublic;
      g.target = this.target;
    } else {
      // ActivityType.Challenge
      const c = body as CreateChallenge;
      c.matric = this.matric;
      c.type = this.type;
      if (c.type !== ChallengeType.UserVsUser) {
        c.tem = [];
        if (c.type === ChallengeType.UserVsTeam) {
          if (this.groupDetail !== undefined) {
            c.tem.push({ id: this.groupDetail.group_id });
          }
        } else {
          // ChallengeType.TeamVsTeam
          if (this.tem1 !== undefined) {
            c.tem.push({ id: this.tem1.group_id });
            if (this.tem2 != undefined) c.tem.push({ id: this.tem2.group_id });
          }
        }
      }
    }
    return body;
  }
}

// API interfaces

export interface ShowHoneycomb {
  showHoneyComb: Bool; // 0 | 1
}

export interface ActivityMember {
  id?: string;
  userId?: string;
  memberType: ActivityMemberType;
  groupId?: string; // group which User belongs
  userInfo?: UserInfo;
  inviteAccepted?: number; // 0 | 1
  is_active?: number; // 0 | 1
  is_mute?: number; // 0 | 1
}

export enum ActivityMemberType {
  Temate = 1,
  Tem = 2,
}

export interface LeaderGroup {
  _id: string;
  image?: string;
  name: string;
}

export interface ActivityGroup {
  _id: string;
  image?: string;
  group_title: string;
}

export interface CreateGoalOrChallenge {
  name: string;
  description: string;
  startDate: string | number;
  duration: string;
  anyActivity: boolean;
  activityTypes: number[];
  members: ActivityMember[];
  isOpen: boolean;
  // isModelOpen: boolean
  doNotParticipate?: boolean; // for company account
  fundraising?: CreateFundraising;
}

interface CreateGoalOrChallengeInternal
  extends Omit<CreateGoalOrChallenge, "activityTypes"> {
  activityTypes: ActivityTypeInList[];
}

export interface CreateChallenge {
  type?: ChallengeType;
  tem?: TemForChallenge[];
  matric?: Metrics[];
}

export interface CreateGoal {
  target?: GoalTarget[];
  isPublic?: boolean;
  isPerPersonGoal?: boolean;
}

export interface CreateFundraising {
  destination?: GNCFundraisingDestination;
  goalAmount?: number;
}

interface TemForChallenge {
  id: string;
}
