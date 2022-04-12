//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Reactronic, Reentrance, reentrance, Ref, ObservableObject, transaction, reaction } from 'reactronic'
import { App } from '../App'
import { GoalOrChallenge } from 'models/data/GoalOrChallenge'
import { Api, ApiData } from '../Api'
import { populate } from 'common/populate'
import { SearchCategory, SearchResponse, PeopleResult, PostsResult, GroupsResult, SearchRequest, getSearchCategoryMap, PeopleSubCategory, PeopleSubSubCategory, getSearchTitleForPeople, PostsSubCategory, getSearchTitleForPosts, GroupsSubCategory, getSearchTitleForGroups, getSearchTitleForGoals, getSearchTitleForChallenges, EventsResult, EventsSubCategory, EventsSubSubCategory, getSearchTitleForEvents } from './SearchCategory'
import { CategorySearchManager } from './CategorySearchManager'
import { EventsSearchManager, GoalsChallengesSearchManager, GroupsSearchManager, PeopleSearchManager, PostsSearchManager } from 'screens/search/CategorySearch'

const DefaultSearchCategory = SearchCategory.AllCategories
const GlobalSearchLimit = 3
const SearchPrefix = 'search'

export class GlobalSearchManager extends ObservableObject implements SearchResponse {
  filter: string
  category: SearchCategory

  people: PeopleResult
  posts: PostsResult
  groups: GroupsResult
  goals: GoalOrChallenge[]
  challenges: GoalOrChallenge[]
  events: EventsResult

  categoryManager?: CategorySearchManager<any>

  constructor() {
    super()
    this.filter = ''
    this.category = DefaultSearchCategory
    this.people = new PeopleResult()
    this.posts = new PostsResult()
    this.groups = new GroupsResult()
    this.goals = []
    this.challenges = []
    this.events = new EventsResult()
    this.categoryManager = undefined
  }

  getNoDataCaption(): string {
    let result: string
    switch (this.category) {
      case SearchCategory.AllCategories:
        result = 'Nothing found.'
        break
      case SearchCategory.Challenges:
        result = 'No challenges found.'
        break
      case SearchCategory.Goals:
        result = 'No goals found.'
        break
      case SearchCategory.Groups:
        result = 'No tēms found.'
        break
      case SearchCategory.People:
        result = 'No tēmates found.'
        break
      case SearchCategory.Posts:
        result = 'No posts found.'
        break
      case SearchCategory.Events:
        result = 'No events found.'
        break
    }
    return result
  }

  getNoDataText(): string {
    let ending: string
    switch (this.category) {
      case SearchCategory.AllCategories:
        ending = 'friends, their posts, or public tēms, goals and challenges.'
        break
      case SearchCategory.Challenges:
        ending = 'public challenges.'
        break
      case SearchCategory.Goals:
        ending = 'public goals.'
        break
      case SearchCategory.Groups:
        ending = 'public tēms to join and tēms you are member of.'
        break
      case SearchCategory.People:
        ending = 'friends.'
        break
      case SearchCategory.Posts:
        ending = 'posts created by your friends.'
        break
      case SearchCategory.Events:
        ending = 'events.'
        break
    }
    return 'Enter text in the search field or change your entered text to find ' + ending
  }

  show(): void {
    App.rootNavigation.push('GlobalSearch')
  }

  @transaction
  resetCategoryManager(): void {
    if (this.categoryManager !== undefined) {
      Reactronic.dispose(this.categoryManager)
    }
    this.categoryManager = undefined
  }

  //#region Category Search

  @transaction
  showPeopleSearch(filterRef: Ref<string>, sub: PeopleSubCategory, subSub: PeopleSubSubCategory): void {
    const url = SearchPrefix + `/${SearchCategory.People}/${sub}/${subSub}`
    const title = getSearchTitleForPeople(sub, subSub)
    const manager = new PeopleSearchManager(url, title, filterRef)
    this.showCategorySearch(manager)
  }

  @transaction
  showPostsSearch(filterRef: Ref<string>, sub: PostsSubCategory): void {
    const url = SearchPrefix + `/${SearchCategory.Posts}/${sub}`
    const title = getSearchTitleForPosts(sub)
    const manager = new PostsSearchManager(url, title, filterRef)
    this.showCategorySearch(manager)
  }

  @transaction
  showGroupsSearch(filterRef: Ref<string>, sub: GroupsSubCategory): void {
    const url = SearchPrefix + `/${SearchCategory.Groups}/${sub}`
    const title = getSearchTitleForGroups(sub)
    const manager = new GroupsSearchManager(url, title, filterRef)
    this.showCategorySearch(manager)
  }

  @transaction
  showGoalsSearch(filterRef: Ref<string>): void {
    const url = SearchPrefix + `/${SearchCategory.Goals}`
    const title = getSearchTitleForGoals()
    const manager = new GoalsChallengesSearchManager(url, title, filterRef)
    this.showCategorySearch(manager)
  }

  @transaction
  showChallengesSearch(filterRef: Ref<string>): void {
    const url = SearchPrefix + `/${SearchCategory.Challenges}`
    const title = getSearchTitleForChallenges()
    const manager = new GoalsChallengesSearchManager(url, title, filterRef)
    this.showCategorySearch(manager)
  }

  @transaction
  showEventsSearch(filterRef: Ref<string>, sub: EventsSubCategory, subSub: EventsSubSubCategory): void {
    const url = SearchPrefix + `/${SearchCategory.Events}/${sub}/${subSub}`
    const title = getSearchTitleForEvents(sub, subSub)
    const manager = new EventsSearchManager(url, title, filterRef)
    this.showCategorySearch(manager)
  }

  private showCategorySearch(manager: CategorySearchManager<any>): void {
    this.resetCategoryManager()
    this.categoryManager = manager
    App.rootNavigation.push('CategorySearch')
  }

  //#endregion

  count(): number {
    const result =
      this.people.count()
      + this.posts.count()
      + this.groups.count()
      + this.goals.length
      + this.challenges.length
      + this.events.count()
    return result
  }

  @transaction
  reset(): void {
    this.filter = ''
    this.category = DefaultSearchCategory
  }

  private refreshPulse: boolean = false

  @transaction
  refresh(): void {
    if (this.filter) {
      this.refreshPulse = !this.refreshPulse
    }
  }

  @reaction @reentrance(Reentrance.CancelPrevious)
  protected async search(): Promise<void> {
    this.refreshPulse // subscribe to refresh
    this.clearResult()
    if (this.filter) {
      const body: SearchRequest = {
        filter: this.filter,
        category: getSearchCategoryMap(this.category),
        limit: GlobalSearchLimit,
      }
      const response: ApiData<SearchResponse> = await Api.call('POST', 'search', body)
      console.log('Search')
      const data = response.data
      if (data.people)
        this.people.setData(data.people)
      if (data.posts)
        this.posts.setData(data.posts)
      if (data.groups)
        this.groups.setData(data.groups)
      if (data.goals)
        this.setGoals(data.goals)
      if (data.challenges)
        this.setChallenges(data.challenges)
      if (data.events)
        this.events.setData(data.events)
    }
  }

  private clearResult(): void {
    this.people.clear()
    this.posts.clear()
    this.groups.clear()
    this.clearGoals()
    this.clearChallenges()
    this.events.clear()
  }

  private clearGoals(): void {
    this.goals.forEach(x => Reactronic.dispose(x))
    this.goals = []
  }

  private clearChallenges(): void {
    this.challenges.forEach(x => Reactronic.dispose(x))
    this.challenges = []
  }

  private setGoals(data: GoalOrChallenge[]): void {
    this.goals.forEach(x => Reactronic.dispose(x))
    this.goals = data.map(x => populate(new GoalOrChallenge, x))
  }

  private setChallenges(data: GoalOrChallenge[]): void {
    this.clearChallenges()
    this.challenges = data.map(x => populate(new GoalOrChallenge, x))
  }
}
