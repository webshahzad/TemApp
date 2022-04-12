//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Reactronic, ObservableObject, transaction } from 'reactronic'
import { populate } from 'common/populate'
import { UserInfo } from 'models/data/UserInfo'
import { FeedElement } from 'models/data/Feed'
import { ChatRoom } from 'models/data/ChatRoom'
import { GoalOrChallenge } from 'models/data/GoalOrChallenge'
import { EventInfo } from 'models/data/EventInfo'

//#region Request

export enum SearchCategory {
  AllCategories = 'all',
  People = 'people',
  Posts = 'posts',
  Groups = 'groups',
  Goals = 'goals',
  Challenges = 'challenges',
  Events = 'events',
}

export const AllSearchCategories: SearchCategory[] = Object.values(SearchCategory)

export function getCategoryText(value: SearchCategory): string {
  let result: string
  switch (value) {
    case SearchCategory.AllCategories:
      result = 'All categories'
      break
    case SearchCategory.People:
      result = 'People'
      break
    case SearchCategory.Posts:
      result = 'Posts'
      break
    case SearchCategory.Groups:
      result = 'Tēms'
      break
    case SearchCategory.Goals:
      result = 'Goals'
      break
    case SearchCategory.Challenges:
      result = 'Challenges'
      break
    case SearchCategory.Events:
      result = 'Calendar Events'
      break
  }
  return result
}

type SearchCategoryMap = {
  [key in Exclude<SearchCategory, SearchCategory.AllCategories>]: boolean
}

export function getSearchCategoryMap(category: SearchCategory): SearchCategoryMap {
  const result: SearchCategoryMap = {
    people: false,
    posts: false,
    groups: false,
    goals: false,
    challenges: false,
    events: false,
  }
  if (category === SearchCategory.AllCategories) {
    for (const x of Object.keys(result))
      result[x] = true
  }
  else
    result[category] = true
  return result
}

export type SearchRequest = {
  filter: string
  category: SearchCategoryMap
  limit?: number
}

//#endregion

//#region People Response

export enum PeopleSubCategory {
  Name = 'name',
  Location = 'location',
  Gym = 'gym',
  Interests = 'interests'
}

export const AllPeopleSubCategories = Object.values(PeopleSubCategory)

export function getPeopleSubCategoryText(value: PeopleSubCategory): string {
  let result: string
  switch (value) {
    case PeopleSubCategory.Name:
      result = 'Name'
      break
    case PeopleSubCategory.Location:
      result = 'Location'
      break
    case PeopleSubCategory.Gym:
      result = 'Gym'
      break
    case PeopleSubCategory.Interests:
      result = 'Interests'
      break
  }
  return result
}

export enum PeopleSubSubCategory {
  Friends = 'friends',
  Other = 'other'
}

export const AllPeopleSubSubCategories = Object.values(PeopleSubSubCategory)

export function getPeopleSubSubCategoryText(value: PeopleSubSubCategory): string {
  let result: string
  switch (value) {
    case PeopleSubSubCategory.Friends:
      result = 'Tēmates'
      break
    case PeopleSubSubCategory.Other:
      result = 'Non-tēmates'
      break
  }
  return result
}

type PeopleCategoryResult = {
  [k in PeopleSubCategory]: PeopleSubCategoryResult
}

type PeopleSubCategoryResult = {
  [x in PeopleSubSubCategory]: UserInfo[]
}

// Internal data

class PeopleSubCategoryData extends ObservableObject implements PeopleSubCategoryResult {
  friends: UserInfo[] = [];
  other: UserInfo[] = [];

  count(): number {
    let result = 0
    for (const k of AllPeopleSubSubCategories) {
      result += this[k].length
    }
    return result
  }

  @transaction
  clear(): void {
    for (const k of AllPeopleSubSubCategories) {
      this[k].forEach(u => Reactronic.dispose(u))
      this[k] = []
    }
  }

  @transaction
  setData(data: PeopleSubCategoryResult): void {
    this.clear()
    for (const k of AllPeopleSubSubCategories) {
      this[k] = data[k].map(u => populate(new UserInfo, u))
    }
  }
}

export class PeopleResult extends ObservableObject implements PeopleCategoryResult {
  name = new PeopleSubCategoryData();
  location = new PeopleSubCategoryData();
  gym = new PeopleSubCategoryData();
  interests = new PeopleSubCategoryData();

  count(): number {
    let result = 0
    for (const k of AllPeopleSubCategories) {
      result += this[k].count()
    }
    return result
  }

  @transaction
  clear(): void {
    for (const k of AllPeopleSubCategories) {
      this[k].clear()
    }
  }

  @transaction
  setData(data: PeopleCategoryResult): void {
    for (const k of AllPeopleSubCategories) {
      this[k].setData(data[k])
    }
  }
}

//#endregion

//#region Posts Response

export enum PostsSubCategory {
  Users = 'people',
  Tags = 'tags',
  Caption = 'caption'
}

export const AllPostsSubCategories = Object.values(PostsSubCategory)

export function getPostsSubCategoryText(value: PostsSubCategory): string {
  let result: string
  switch (value) {
    case PostsSubCategory.Caption:
      result = 'Caption'
      break
    case PostsSubCategory.Tags:
      result = 'Tag'
      break
    case PostsSubCategory.Users:
      result = 'User'
      break
  }
  return result
}

type PostsCategoryResult = {
  [k in PostsSubCategory]: FeedElement[]
}

export class PostsResult extends ObservableObject implements PostsCategoryResult {
  caption: FeedElement[] = [];
  tags: FeedElement[] = [];
  people: FeedElement[] = [];

  count(): number {
    let result = 0
    for (const k of AllPostsSubCategories) {
      result += this[k].length
    }
    return result
  }

  @transaction
  clear(): void {
    for (const k of AllPostsSubCategories) {
      this[k].forEach(u => Reactronic.dispose(u))
      this[k] = []
    }
  }

  @transaction
  setData(data: PostsCategoryResult): void {
    this.clear()
    for (const k of AllPostsSubCategories) {
      this[k] = data[k].map(x => populate(new FeedElement, x))
    }
  }
}

//#endregion

//#region Groups Response

export enum GroupsSubCategory {
  Available = 'available',
  Participating = 'participating'
}

export const AllGroupsSubCategories = Object.values(GroupsSubCategory)

export function getGroupsSubCategoryText(value: GroupsSubCategory): string {
  let result: string
  switch (value) {
    case GroupsSubCategory.Available:
      result = 'Available to Join'
      break
    case GroupsSubCategory.Participating:
      result = 'Participating'
      break
  }
  return result
}

type GroupsCategoryResult = {
  [k in GroupsSubCategory]: ChatRoom[]
}

export class GroupsResult extends ObservableObject implements GroupsCategoryResult {
  available: ChatRoom[] = [];
  participating: ChatRoom[] = [];

  count(): number {
    let result = 0
    for (const k of AllGroupsSubCategories) {
      result += this[k].length
    }
    return result
  }

  @transaction
  clear(): void {
    for (const k of AllGroupsSubCategories) {
      this[k].forEach(u => Reactronic.dispose(u))
      this[k] = []
    }
  }

  @transaction
  setData(data: GroupsCategoryResult): void {
    this.clear()
    for (const k of AllGroupsSubCategories) {
      this[k] = data[k].map(x => populate(new ChatRoom, x))
    }
  }
}

//#endregion

//#region Events Response

export enum EventsSubCategory {
  Future = 'future',
  Past = 'past',
}

export const AllEventsSubCategories = Object.values(EventsSubCategory)

export function getEventsSubCategoryText(value: EventsSubCategory): string {
  let result: string
  switch (value) {
    case EventsSubCategory.Past:
      result = 'Past'
      break
    case EventsSubCategory.Future:
      result = 'Future'
      break
  }
  return result
}

export enum EventsSubSubCategory {
  Available = 'available',
  Participating = 'participating'
}

export const AllEventsSubSubCategories = Object.values(EventsSubSubCategory)

export function getEventsSubSubCategoryText(value: EventsSubSubCategory): string {
  let result: string
  switch (value) {
    case EventsSubSubCategory.Available:
      result = 'Available to join'
      break
    case EventsSubSubCategory.Participating:
      result = 'Participating'
      break
  }
  return result
}

type EventsCategoryResult = {
  [k in EventsSubCategory]: EventsSubCategoryResult
}

type EventsSubCategoryResult = {
  [x in EventsSubSubCategory]: EventInfo[]
}

// Internal data

class EventsSubCategoryData extends ObservableObject implements EventsSubCategoryResult {
  available: EventInfo[] = [];
  participating: EventInfo[] = [];

  count(): number {
    let result = 0
    for (const k of AllEventsSubSubCategories) {
      result += this[k].length
    }
    return result
  }

  @transaction
  clear(): void {
    for (const k of AllEventsSubSubCategories) {
      this[k].forEach(e => Reactronic.dispose(e))
      this[k] = []
    }
  }

  @transaction
  setData(data: EventsSubCategoryResult): void {
    this.clear()
    for (const k of AllEventsSubSubCategories) {
      this[k] = data[k].map(e => populate(new EventInfo, e))
    }
  }
}

export class EventsResult extends ObservableObject implements EventsCategoryResult {
  past = new EventsSubCategoryData();
  future = new EventsSubCategoryData();

  count(): number {
    let result = 0
    for (const k of AllEventsSubCategories) {
      result += this[k].count()
    }
    return result
  }

  @transaction
  clear(): void {
    for (const k of AllEventsSubCategories) {
      this[k].clear()
    }
  }

  @transaction
  setData(data: EventsCategoryResult): void {
    for (const k of AllEventsSubCategories) {
      this[k].setData(data[k])
    }
  }
}

//#endregion

export interface SearchResponse {
  people?: PeopleCategoryResult
  posts?: PostsCategoryResult
  groups?: GroupsCategoryResult
  goals?: GoalOrChallenge[]
  challenges?: GoalOrChallenge[]
  events?: EventsCategoryResult
}

// const COMMON_TITLE = 'Search '
const COMMON_TITLE = ''

export function getSearchTitleForPeople(sub: PeopleSubCategory, subSub: PeopleSubSubCategory): string {
  const result = COMMON_TITLE + getPeopleSubSubCategoryText(subSub) + ' by ' + getPeopleSubCategoryText(sub)
  return result
}

export function getSearchTitleForPosts(sub: PostsSubCategory): string {
  const result = COMMON_TITLE + getCategoryText(SearchCategory.Posts) + ' by ' + getPostsSubCategoryText(sub)
  return result
}

export function getSearchTitleForGroups(sub: GroupsSubCategory): string {
  let result: string
  switch (sub) {
    case GroupsSubCategory.Available:
      result = COMMON_TITLE + getCategoryText(SearchCategory.Groups) + ' ' + getGroupsSubCategoryText(sub)
      break
    case GroupsSubCategory.Participating:
      result = COMMON_TITLE + getGroupsSubCategoryText(sub) + ' ' + getCategoryText(SearchCategory.Groups)
      break
  }
  return result
}

export function getSearchTitleForGoals(): string {
  const result = COMMON_TITLE + getCategoryText(SearchCategory.Goals)
  return result
}

export function getSearchTitleForChallenges(): string {
  const result = COMMON_TITLE + getCategoryText(SearchCategory.Challenges)
  return result
}

export function getSearchTitleForEvents(sub: EventsSubCategory, subSub: EventsSubSubCategory): string {
  const result = COMMON_TITLE + getEventsSubCategoryText(sub) + ' ' + getEventsSubSubCategoryText(subSub) + ' ' + getCategoryText(SearchCategory.Events)
  return result
}
