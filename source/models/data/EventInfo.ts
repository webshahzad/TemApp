//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from "reactronic";
import {
  ActivityMember,
  ActivityMemberType,
} from "./GoalChallengeDetailsModel";
import {
  ActivityScore,
  ActivityStatus,
  GoalTarget,
  Metrics,
} from "./GoalOrChallenge";
import { Bool } from "common/constants";
import { GroupActivity } from "./Activity";
import { UserInfo } from "./UserInfo";

export enum EventType {
  Regular = 1,
  Goal = 2,
  Challenge = 3,
  SignupSheet = 4,
}

export const AllEventTypes = Object.values(EventType).filter(
  (t) => typeof t === "number"
) as EventType[];

export const AllEventTypesToCreate = [EventType.Regular, EventType.SignupSheet];



export function getEventTypeText(v: EventType): string {
  let result: string;
  switch (v) {
    case EventType.Regular:
      result = "Regular event";
      break;
    case EventType.Goal:
      result = "Goal";
      break;
    case EventType.Challenge:
      result = "Challenge";
      break;
    case EventType.SignupSheet:
      result = "Signup Sheet";
      break;
  }
  return result;
}

export enum EventRecurrence {
  Single = 0,
  Daily,
  Weekly,
  EveryTwoWeeks,
  Monthly,
}

export enum EventVisibility {
  Private = "private",
  Temates = "temates",
  Public = "public",
}

export const AllEventVisibility = Object.values(EventVisibility);

export function getEventVisibilityText(v: EventVisibility): string {
  let result: string;
  switch (v) {
    case EventVisibility.Private:
      result = "Private";
      break;
    case EventVisibility.Temates:
      result = "Tēmates";
      break;
    case EventVisibility.Public:
      result = "Public";
      break;
  }
  return result;
}

export const InfiniteEvent = 1;

export class EventInfo extends ObservableObject {
  _id?: string = "";
  // "61f7b46043aec31a707ddd9b"
  eventType: EventType = EventType.Regular;
  activity: number = 0;
  name?: string = undefined;
  title?: string = undefined;
  description: string = "";
  duration: string = "";
  startDate: string = "";
  endDate: string = "";
  created_at: string = "";
  updatedAt: string = "";
  isOpen: boolean = false;
  eventList = [];
  isPosted: boolean = false;
  matric: Metrics[] = []; // typo in API
  members: ActivityMember[] = [];
  membersScore: ActivityScore<UserInfo | GroupActivity>[] = [];
  status: ActivityStatus = ActivityStatus.Completed;
  goalAchievedNotification: Bool = Bool.False;
  goalCreatedBy?: string = undefined;
  halfGoalNotification: Bool = Bool.False;
  halfTimeGoalNotification: Bool = Bool.False;
  halfTime?: number = undefined;
  target: GoalTarget[] = [];
  totalScore?: number = undefined;
  challengeCreatedBy?: string = undefined;
  leader?: string = undefined;
  leaderType?: ActivityMemberType = undefined;
  endsOn: number | string = InfiniteEvent;
  eventReminder: boolean = false;
  reccurEvent: EventRecurrence = EventRecurrence.Single;
  location: EventLocation = new EventLocation();
  acceptedCount: number = 0;
  declinedCount: number = 0;
  pendingCount: number = 0;
  totalCount: number = 0;
  userId: string = "";
  visibility?: EventVisibility = EventVisibility.Private;
  membersCapacity?: number = undefined;
  isUserWaitingToJoin: boolean = false;

  getName(): string {
    return this.name ?? this.title ?? "";
  }

  getStartDate(): Date {
    return new Date(this.startDate);
  }

  getEndDate(): Date {
    return new Date(this.endDate);
  }
}

export class EventLocation extends ObservableObject {
  location: string = "";
  lat: number = 0;
  long: number = 0;
}
