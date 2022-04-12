//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import {
  ObservableObject,
  transaction,
  monitor,
  Reentrance,
  reentrance,
  reaction,
  unobservable,
  Transaction,
  Reactronic,
  standalone,
} from "reactronic";
import { NavigationManager } from "models/app/NavigationManager";
import { Api, ApiData, ApiDataWithCount } from "models/app/Api";
import { Monitors } from "models/app/Monitors";
import {
  ActivityStatus,
  GoalOrChallenge,
  ActivityType,
  GNCFundraising,
  GNCFundraisingDestination,
} from "models/data/GoalOrChallenge";
import { doAsync } from "common/doAsync";
import { PagedList, PagedListLoadingResponse } from "./PagedList";
import { GoalChallengeDetailsModel } from "models/data/GoalChallengeDetailsModel";
import { populate } from "common/populate";
import { App, AppModel } from "./App";
import { HoneyCombType } from "./ExtraHoneyCombs";
import { Linking, ToastAndroid } from "react-native";

export enum GoalFilter {
  All,
  Goals,
  Challenges,
}

export class GoalsAndChallenges extends ObservableObject {
  @unobservable readonly app: AppModel;
  @unobservable readonly tabsManager: NavigationManager<GoalFilter>;
  @unobservable readonly gncManager: GoalChallengeManager;
  @unobservable readonly goalsManager: GoalChallengeManager;
  @unobservable readonly challengesManager: GoalChallengeManager;

  groupChallengesManager?: GoalChallengeManager;

  sideMenuNoItemsText?: string;
  sideMenuTitle?: string;
  sideMenuList?: GoalChallengeList;

  currentTabList: GoalChallengeList;

  currentGoalChallenge?: GoalChallengeDetailsModel;

  constructor(app: AppModel) {
    super();
    this.app = app;
    this.tabsManager = new NavigationManager<GoalFilter>(GoalFilter.All, [
      {
        value: GoalFilter.All,
        name: "All",
      },
      {
        value: GoalFilter.Goals,
        name: "Goals",
      },
      {
        value: GoalFilter.Challenges,
        name: "Challenges",
      },
    ]);
    this.gncManager = new GoalChallengeManager("gnc");
    this.goalsManager = new GoalChallengeManager("goals", ActivityType.Goal);
    this.challengesManager = new GoalChallengeManager(
      "users/challenge",
      ActivityType.Challenge
    );
    this.groupChallengesManager = undefined;
    this.sideMenuNoItemsText = undefined;
    this.sideMenuTitle = undefined;
    this.sideMenuList = undefined;
    this.currentTabList = this.gncManager.open;
    this.currentGoalChallenge = undefined;
  }

  getChallengesManger(): GoalChallengeManager {
    return this.groupChallengesManager ?? this.challengesManager;
  }

  @transaction
  useGroupChallengesManager(groupId: string): void {
    this.useDefaultChallengesManager();
    this.groupChallengesManager = new GoalChallengeManager(
      "chat/groupChallengesList",
      ActivityType.Challenge,
      groupId
    );
  }

  @transaction
  useDefaultChallengesManager(): void {
    if (this.groupChallengesManager) {
      Reactronic.dispose(this.groupChallengesManager);
    }
    this.groupChallengesManager = undefined;
  }

  @monitor(Monitors.Loading) // TODO: separate monitor to show loading status
  @transaction
  async prepareSideMenu(
    list: GoalChallengeList,
    title?: string,
    noItemsText?: string
  ): Promise<void> {
    list.totalCount = undefined; // reset total count to make PagedList.hasMoreItems() work
    await list.loadItems();
    this.sideMenuTitle = title;
    this.sideMenuNoItemsText = noItemsText;
    this.sideMenuList = list;
    list.scrollToTopStamp = Date.now();
  }

  // TODO: eliminate first call after Api.token was set
  @reaction
  protected reloadListOnTabChange(): void {
    if (Api.isAuthenticated()) {
      switch (this.tabsManager.currentNavigation) {
        case GoalFilter.All:
          this.currentTabList = this.gncManager.open;
          break;
        case GoalFilter.Goals:
          this.currentTabList = this.goalsManager.open;
          break;
        case GoalFilter.Challenges:
          this.currentTabList =
            this.groupChallengesManager?.open ?? this.challengesManager.open;
          break;
      }
      doAsync(this.currentTabList.loadItems);
    }
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async create(model: GoalChallengeDetailsModel): Promise<string> {
    try {
      const apiPath = this.getApiPath(model.gncType);
      const body = model.getDto();
      console.log("getDto", JSON.stringify(body, null, 2));

      const response = await Api.call("POST", apiPath, body);

      await this.currentTabList.loadItems();
      console.log("GNCresponse", response);
      return response.message;
    } catch (err) {
      console.log("Error", JSON.stringify(err, null, 2));
    }
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async update(model: GoalChallengeDetailsModel): Promise<string> {
    const apiPath = this.getApiPath(model.gncType);
    const body: any = model.getDto();
    if (model.gncType === ActivityType.Goal) {
      body.goal_id = model._id;
    } else {
      body.challenge_id = model._id;
    }
    const response: ApiData<GoalChallengeDetailsModel> = await Api.call(
      "PUT",
      `${apiPath}`,
      body
    );
    const message = response.message;
    this.updateItemInList(model);
    return message;
  }

  @transaction
  @monitor(Monitors.Refreshing)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async refreshCurrentGoalChallenge(): Promise<void> {
    if (this.currentGoalChallenge !== undefined) {
      this.currentGoalChallenge = await this.getDetails(
        this.currentGoalChallenge.gncType,
        this.currentGoalChallenge._id,
        this.currentGoalChallenge.listItem
      );
    }
  }

  @reaction
  protected async refreshDetailsOnAppFocus(): Promise<void> {
    if (this.app.state === "active") {
      await this.refreshCurrentGoalChallenge();
    }
  }

  @transaction
  resetCurrentGoalChallenge(): void {
    if (this.currentGoalChallenge) {
      Reactronic.dispose(this.currentGoalChallenge);
      this.currentGoalChallenge = undefined;
    }
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async getDetails(
    gncType: ActivityType,
    id: string,
    listItem: GoalOrChallenge | null = null
  ): Promise<GoalChallengeDetailsModel> {
    const apiPath = this.getApiPath(gncType);
    const page = 1;
    const response: ApiData<GoalChallengeDetailsModel> = await Api.call(
      "GET",
      `${apiPath}/${id}?page=${page}`
    );
    const result: GoalChallengeDetailsModel = standalone(() =>
      Transaction.run(() => {
        const model = populate(
          new GoalChallengeDetailsModel(gncType),
          response.data
        );
        if (response.data.fundraising)
          model.fundraising = populate(
            new GNCFundraising(),
            response.data.fundraising
          );
        return model;
      })
    );
    result.memberScorePage = page;
    result.listItem = listItem;
    this.updateItemInList(result);
    const type =
      gncType === ActivityType.Goal
        ? HoneyCombType.Goal
        : HoneyCombType.Challenge;
    result.showHoneyComb = await App.user.extraHoneyCombs.isAddedToDashboard(
      type,
      id
    );
    return result;
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async loadMoreDetailsScore(model: GoalChallengeDetailsModel): Promise<void> {
    if (model.needToLoadMoreMemberScore()) {
      const apiPath = this.getApiPath(model.gncType);
      const id = model._id;
      const page = model.memberScorePage + 1;
      const response: ApiData<GoalChallengeDetailsModel> = await Api.call(
        "GET",
        `${apiPath}/${id}?page=${page}`
      );
      const membersScoreMutable = model.membersScore.toMutable();
      membersScoreMutable.push(...response.data.membersScore);
      model.membersScore = membersScoreMutable;
      model.memberScorePage = page;
    }
  }

  /**
   * Join goal or challenge
   * @param gncType type of the event, used to select API path accordingly
   * @param id identifier of the event
   * @param list `GoalChallengeList` or `GoalOrChallenge[]` to update after joining. Introduced to handle independent lists in `GlobalSearch`.
   */
  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async join(
    gncType: ActivityType,
    id: string,
    listItem: GoalOrChallenge | null
  ): Promise<string> {
    const apiPath = this.getApiPath(gncType);
    const response: ApiData<void> = await Api.call(
      "POST",
      `${apiPath}/${id}/join`
    );
    // update item in list when joining
    if (listItem) {
      listItem.isJoined = true;
      listItem.memberCount++;
    }
    return response.message || "Joined Successfully";
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async openDonationPage(event: GoalChallengeDetailsModel): Promise<void> {
    const eventType: string =
      event.gncType === ActivityType.Goal ? "goal" : "challenge";
    try {
      const response: ApiData<{
        link: string;
        sessionToken: string;
        completed: boolean;
      }> = await Api.call("POST", "fundraising/start", {
        eventId: event._id,
        eventType,
      });
      if (!response.data.completed) {
        await Linking.openURL(response.data.link);
      } else {
        ToastAndroid.show(
          "Fundraising has already finished",
          ToastAndroid.SHORT
        );
      }
    } catch (e) {
      ToastAndroid.show(
        "Something went wrong. Please try again later.",
        ToastAndroid.SHORT
      );
    }
  }

  private getApiPath(gncType: ActivityType): string {
    const apiPath: string =
      gncType === ActivityType.Goal ? "goals" : "users/challenge";
    return apiPath;
  }

  private updateItemInList(result: GoalChallengeDetailsModel): void {
    const itemToUpdate = result.listItem;
    if (itemToUpdate) {
      itemToUpdate.memberCount = result.memberCount;
      itemToUpdate.scorePercentage = result.scorePercentage;
      itemToUpdate.myScore = result.myScore.slice();
      itemToUpdate.target = result.target?.slice();
      itemToUpdate.matric = result.matric?.slice();
      itemToUpdate.name = result.name;
      itemToUpdate.endDate = result.endDate;
      itemToUpdate.duration = result.duration;
      itemToUpdate.activityTypes = result.activityTypes.slice();
      itemToUpdate.anyActivity = result.anyActivity;
      itemToUpdate.isPerPersonGoal = result.isPerPersonGoal;
      if (result.leader) itemToUpdate.leader = result.leader;
    }
  }

  /**
   * Open Goal details screen
   * @param id identifier of Goal to load
   * @param listItem `GoalOrChallenge` to update after editing. Introduced to handle independent lists in `GlobalSearch`.
   */
  @transaction
  async openGoalDetails(
    id: string,
    listItem: GoalOrChallenge | null
  ): Promise<void> {
    this.currentGoalChallenge = await this.getDetails(
      ActivityType.Goal,
      id,
      listItem
    );
    this.currentGoalChallenge.listItem = listItem;
    setTimeout(() => App.rootNavigation.push("GoalDetails"), 0);
  }

  /**
   * Open Challenge details screen
   * @param id identifier of Challenge to load
   * @param listItem `GoalOrChallenge` to update after editing. Introduced to handle independent lists in `GlobalSearch`.
   */
  @transaction
  async openChallengeDetails(
    id: string,
    listItem: GoalOrChallenge | null
  ): Promise<void> {
    this.currentGoalChallenge = await this.getDetails(
      ActivityType.Challenge,
      id,
      listItem
    );
    this.currentGoalChallenge.listItem = listItem;
    setTimeout(() => App.rootNavigation.push("ChallengeDetails"), 0);
  }

  @transaction
  createGoal(): void {
    const model = new GoalChallengeDetailsModel(ActivityType.Goal);
    if (App?.user.stored.isCompanyAccount) model.isOpen = true;
    App?.rootNavigation.push("EditGoalChallenge", { model, isNew: true });
  }
  @transaction
  resetGoal(): void {}

  @transaction
  createChallenge(): void {
    const model = new GoalChallengeDetailsModel(ActivityType.Challenge);
    if (App?.user.stored.isCompanyAccount) model.isOpen = true;
    App?.rootNavigation.push("EditGoalChallenge", { model, isNew: true });
  }

  @transaction
  editGoalOrChallenge(model: GoalChallengeDetailsModel): void {
    // TODO: clone model to eliminate side-effects after cancelling Edit
    App.rootNavigation.push("EditGoalChallenge", { model, isNew: false });
  }
}

export class GoalChallengeManager extends ObservableObject {
  @unobservable readonly open: GoalChallengeList;
  @unobservable readonly upcoming: GoalChallengeList;
  @unobservable readonly completed: GoalChallengeList;

  @unobservable readonly groupId?: string;

  constructor(apiPath: string, gncType?: ActivityType, groupId?: string) {
    super();
    this.open = new GoalChallengeList({
      status: ActivityStatus.InProgress,
      gncType,
      apiPath,
      groupId,
    });
    this.upcoming = new GoalChallengeList({
      status: ActivityStatus.Upcoming,
      gncType,
      apiPath,
      groupId,
    });
    this.completed = new GoalChallengeList({
      status: ActivityStatus.Completed,
      gncType,
      apiPath,
      groupId,
    });
    this.groupId = groupId;
  }
}

export class GoalChallengeList extends PagedList<GoalOrChallenge> {
  @unobservable readonly apiPath: string;
  @unobservable readonly activityStatus: ActivityStatus;
  @unobservable readonly gncType?: ActivityType;
  @unobservable readonly groupId?: string;

  pendingCount: number = 0;
  filter?: string;

  @unobservable scrollToTopStamp: number = 0;

  constructor(o: {
    apiPath: string;
    status: ActivityStatus;
    gncType?: ActivityType;
    groupId?: string;
  }) {
    super((page) => this.loadActivities(page));
    this.apiPath = o.apiPath;
    this.activityStatus = o.status;
    this.gncType = o.gncType;
    this.groupId = o.groupId;
    this.filter = undefined;
  }

  @transaction
  setFilter(value: string | undefined): void {
    if (this.filter !== value) {
      this.filter = value;
      void this.loadItems();
    }
  }

  @transaction
  @monitor(Monitors.Refreshing)
  private async loadActivities(
    page: number
  ): Promise<PagedListLoadingResponse<GoalOrChallenge>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("status", this.activityStatus.toString());
    if (this.groupId) params.append("group_id", this.groupId);
    if (this.filter !== undefined && this.filter.length > 0) {
      params.append("filter", encodeURIComponent(this.filter));
    }
    const paramsString = "?" + params.toString();
    const response: ApiDataWithCount<GoalOrChallenge[]> = await Api.call(
      "GET",
      this.apiPath + paramsString
    );
    // there is pendingCount on first page
    if (page === this.firstPage) this.pendingCount = response.count;
    const newElements = response.data.map((e) =>
      populate(new GoalOrChallenge(), e)
    );
    // 'goals' and 'users/challenge' API routes won't return gncType of items,
    // have to set it manually
    if (this.gncType !== undefined) {
      const t = this.gncType;
      newElements.forEach((e) => (e.gncType = t));
    }
    // TODO: return updatedAt from API to re-render properly
    newElements.forEach((e) => (e.updatedAt = Date.now()));
    return {
      items: newElements,
      totalCount: newElements.length > 0 ? undefined : this.items.length,
    };
  }
}
