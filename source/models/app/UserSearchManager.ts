//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import {
  ObservableObject,
  transaction,
  reaction,
  reentrance,
  Reentrance,
  unobservable,
  throttling,
} from "reactronic";
import { Alert, ToastAndroid } from "react-native";
import Contacts from "react-native-contacts";
import { AccessToken, LoginManager } from "react-native-fbsdk";

import { Api, ApiData } from "models/app/Api";
import { UserInfo } from "models/data/UserInfo";
import { PagedList, PagedListLoadingResponse } from "./PagedList";
import { Bool } from "common/constants";
import { populate } from "common/populate";
import { PermissionsAndroid } from "react-native";

const FacebookFriendQueryBaseUrl =
  "https://graph.facebook.com/v2.5/me/friends?access_token=";

export interface LoadSearchOptions {
  search?: string;
}

export enum SearchMode {
  Friends,
  AllUsers,
}

export enum AcceptOrReject {
  Accept,
  Reject,
}

export class UserSearchManager extends ObservableObject {
  searchMode: SearchMode;
  @unobservable readonly temates: PagedList<UserInfo, LoadSearchOptions>;
  @unobservable readonly suggestions: PagedList<UserInfo>;

  @unobservable readonly sentRequests: PagedList<UserInfo>;
  @unobservable readonly pendingRequests: PagedList<UserInfo>;
  sentRequestsExpanded: boolean;
  pendingRequestsExpanded: boolean;

  searchFriendListFilter: string;

  @unobservable readonly blocked: PagedList<UserInfo, string>;
  blockedFilter: string;

  constructor() {
    super();
    this.searchMode = SearchMode.Friends;
    this.temates = new PagedList<UserInfo, LoadSearchOptions>(
      loadTemates,
      usersEqual
    );
    this.suggestions = new PagedList<UserInfo>(
      this.loadSuggestions,
      usersEqual
    );

    this.sentRequests = new PagedList<UserInfo>(
      this.loadSentRequests,
      usersEqual
    );
    this.pendingRequests = new PagedList<UserInfo>(
      this.loadPendingRequests,
      usersEqual
    );
    this.sentRequestsExpanded = false;
    this.pendingRequestsExpanded = false;

    this.searchFriendListFilter = "";

    this.blocked = new PagedList<UserInfo, string>(this.loadBlockedUsers);
    this.blockedFilter = "";
  }

  @transaction
  @reentrance(Reentrance.CancelPrevious)
  setSearchMode(value: SearchMode): void {
    if (this.searchMode !== value) {
      this.searchMode = value;
      if (value === SearchMode.AllUsers) {
        void this.suggestions.loadItems();
      } else {
        void this.temates.loadItems();
        void this.sentRequests.loadItems();
        void this.pendingRequests.loadItems();
        this.sentRequestsExpanded = false;
        this.pendingRequestsExpanded = false;
      }
    }
  }

  @transaction
  setBlockedFilter(value: string): void {
    this.blockedFilter = value;
  }

  clearBlockedFilter(): void {
    this.setBlockedFilter("");
  }

  @reaction
  protected filterBlockedUsers(): void {
    if (Api.isAuthenticated()) {
      void this.blocked.loadItems(this.blockedFilter);
    }
  }

  @transaction
  async sendRequest(user: UserInfo): Promise<void> {
    try {
      await Api.call("PUT", "network/sendRequest", {
        friend_id: user._id,
      });
      user.is_friend = Bool.True;
      await this.sentRequests.loadItems();
      this.suggestions.removeItem(user);

      ToastAndroid.show("Request sent", ToastAndroid.SHORT);
    } catch (e) {
      console.log(e);
    }
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async acceptOrRejectFriendRequest(
    user: UserInfo,
    action: AcceptOrReject
  ): Promise<void> {
    if (action === AcceptOrReject.Accept) await this.acceptRequest(user);
    else if (action === AcceptOrReject.Reject) await this.rejectRequest(user);
  }

  private async acceptRequest(user: UserInfo): Promise<void> {
    try {
      await Api.call("PUT", "network/acceptRequest", {
        friend_id: user._id,
      });
      this.pendingRequests.removeItem(user);
      await this.temates.loadItems();
      Alert.alert("Request has been accepted");
    } catch (e) {
      console.log(e);
    }
  }

  private async rejectRequest(user: UserInfo): Promise<void> {
    try {
      await Api.call("PUT", "network/rejectRequest", {
        friend_id: user._id,
      });
      this.pendingRequests.removeItem(user);
    } catch (e) {
      console.log(e);
    }
  }

  @transaction
  async remindUser(user: UserInfo): Promise<void> {
    try {
      await Api.call("PUT", "network/remind", {
        friend_id: user._id,
      });
      Alert.alert("User has been reminded");
    } catch (e) {
      console.log(e);
    }
  }

  @transaction
  async deleteRequest(user: UserInfo): Promise<void> {
    try {
      await Api.call("DELETE", "network/sentRequest", {
        friend_id: user._id,
      });
      this.sentRequests.removeItem(user);
    } catch (e) {
      console.log(e);
    }
  }

  @transaction
  async deleteTemate(user: UserInfo): Promise<void> {
    try {
      await Api.call("DELETE", "network/friend", {
        friend_id: user._id,
      });
      this.temates.removeItem(user);
    } catch (e) {
      console.log(e);
    }
  }

  @transaction
  async blockUser(user: UserInfo): Promise<void> {
    try {
      await Api.call("POST", "users/blockUser", {
        _id: user._id,
      });

      this.temates.removeItem(user);
      this.suggestions.removeItem(user);
      this.sentRequests.removeItem(user);
      this.pendingRequests.removeItem(user);
    } catch (e) {
      console.log(e);
    }
  }

  @transaction
  async unblockUser(user: UserInfo): Promise<void> {
    try {
      await Api.call("POST", "users/unblockUser", {
        _id: user._id,
      });
      this.blocked.removeItem(user);
    } catch (e) {
      console.log(e);
    }
  }

  @reaction
  @throttling(1000)
  @reentrance(Reentrance.CancelPrevious)
  protected updateTemates(): void {
    if (Api.isAuthenticated()) {
      void this.temates.loadItems({ search: this.searchFriendListFilter });
    }
  }

  private async loadSuggestions(
    page: number
  ): Promise<PagedListLoadingResponse<UserInfo>> {
    const response = await Api.call<ApiData>(
      "GET",
      `network/suggestions/${page}`
    );
    return {
      items: convertServerUsers(response.data as any[]),
    };
  }

  private async loadSentRequests(
    page: number
  ): Promise<PagedListLoadingResponse<UserInfo>> {
    const response = await Api.call<ApiData>(
      "GET",
      `network/sentRequest?page=${page}`
    );
    return {
      items: convertServerUsers(response.data as any[]),
      totalCount: (response as any).count,
    };
  }

  private async loadPendingRequests(
    page: number
  ): Promise<PagedListLoadingResponse<UserInfo>> {
    const response = await Api.call<ApiData>(
      "GET",
      `network/pendingRequest?page=${page}`
    );
    return {
      items: convertServerUsers(response.data as any[]),
      totalCount: (response as any).count,
    };
  }

  private async loadBlockedUsers(
    page: number,
    options?: string
  ): Promise<PagedListLoadingResponse<UserInfo>> {
    const response = options
      ? await Api.call<ApiData>(
          "POST",
          `users/searchBlockedUser?page=${page}`,
          {
            query: options ?? "",
          }
        )
      : await Api.call<ApiData>("GET", `users/getBlockUserList?page=${page}`);
    return {
      items: convertServerUsers(response.data as any[]),
    };
  }

  @reaction
  protected loadTematesOnStart(): void {
    if (Api.isAuthenticated()) {
      // void this.temates.loadItems()
      void this.sentRequests.loadItems();
      void this.pendingRequests.loadItems();
      void this.suggestions.loadItems();
    }
  }

  @transaction
  async readPhoneContacts(): Promise<void> {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      );
      const contacts = await Contacts.getAll();
      const allPhones: string[] = [];
      for (const contact of contacts) {
        const phones: string[] = contact.phoneNumbers.map(
          (phone) => phone.number
        );
        allPhones.push(...phones);
      }
      if (allPhones.length) {
        await this.syncContacts({
          type: 1,
          friends: allPhones,
        });
        ToastAndroid.show(
          "Your contacts will appear in suggestions soon",
          ToastAndroid.LONG
        );
      } else {
        ToastAndroid.show("No contacts found", ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log(err);
    }
  }

  @transaction
  async readFacebookContacts(): Promise<void> {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "user_friends",
      ]);
      if (!result.isCancelled) {
        const tokenInfo = await AccessToken.getCurrentAccessToken();
        if (!tokenInfo) {
          console.log("Failed to receive Facebook token");
          ToastAndroid.show(
            "Error connecting to Facebook account",
            ToastAndroid.SHORT
          );
        } else {
          const token = tokenInfo.accessToken;
          const result = await fetch(
            `${FacebookFriendQueryBaseUrl}${token}&fields=id,first_name,last_name,name,email,picture`
          );
          const friends = await result.json();
          if (friends.data.length) {
            await this.syncContacts({
              type: 2,
              friends: friends.data.map((user: any) => user.id),
            });
            ToastAndroid.show(
              "Your Facebook contacts will appear in suggestions soon",
              ToastAndroid.LONG
            );
          } else {
            ToastAndroid.show("No contacts found", ToastAndroid.SHORT);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  private async syncContacts(contacts: any): Promise<void> {
    await Api.call("POST", "network/sync_contacts", contacts);
    await this.suggestions.loadItems();
  }
}

function convertServerUsers(data: any[]): UserInfo[] {
  return data.map((x) => {
    const u = new UserInfo();
    populate(u, x);
    return u;
  });
}

export function usersEqual(user1: UserInfo, user2: UserInfo): boolean {
  return user1._id === user2._id;
}

export async function loadTemates(
  page: number,
  options?: LoadSearchOptions
): Promise<PagedListLoadingResponse<UserInfo>> {
  let parameters = `page=${page}`;
  if (options?.search) parameters += `&text=${options.search}`;
  const response = await Api.call<ApiData>(
    "GET",
    `network/friendList?${parameters}`
  );
  return {
    items: convertServerUsers(response.data as any[]),
    totalCount: (response as any).count,
  };
}
