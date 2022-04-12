//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { monitor, Reentrance, reentrance, transaction } from "reactronic";
import { Refreshable } from "common/Refreshable";
import { Api, ApiData } from "./Api";
import { Monitors } from "./Monitors";
import { Interest } from "models/data/Interest";
import { populate } from "common/populate";
import { App } from "./App";
import { Alert } from "react-native";

export class Interests extends Refreshable {
  all: Interest[] = [];
  selected: Interest[] = [];
  userInterestsIndexes: number[] = [];

  isSelected(index: number): boolean {
    return this.userInterestsIndexes.includes(index);
  }

  @transaction
  selectUserInterests(userInterests: string[]): void {
    const userInterestsIndexesMutable = this.userInterestsIndexes.toMutable();
    for (let i = 0; i < this.all.length; i++) {
      if (userInterests.includes(this.all[i]._id))
        userInterestsIndexesMutable.push(i);
    }
    this.userInterestsIndexes = userInterestsIndexesMutable;
  }

  @transaction
  toggleInterest(index: number): void {
    const i = this.userInterestsIndexes.findIndex((x) => x === index);
    const userInterestsIndexesMutable = this.userInterestsIndexes.toMutable();
    if (i >= 0) {
      userInterestsIndexesMutable.splice(i, 1);
    } else {
      userInterestsIndexesMutable.push(index);
    }
    this.userInterestsIndexes = userInterestsIndexesMutable;
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async updateSelected(): Promise<void> {
    const selectedIds = this.userInterestsIndexes.map((i) => this.all[i]._id);
    const body: SelectInterests = {
      interest: selectedIds,
    };
    const response = await Api.call<ApiData<Interest[]>>(
      "POST",
      "interests/select",
      body
    );
    populate(App.user, body, ["interest"]);
  }

  @transaction
  async reload(): Promise<void> {
    await this.load();
    this.userInterestsIndexes = [];
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  protected async refresh(): Promise<void> {
    try {
      const response = await Api.call<ApiData<Interest[]>>("GET", "interests");
      
      this.all = response.data.map((x) => {
        const interest = new Interest();
        populate(interest, x);
        return interest;
      });
      this.userInterestsIndexes = [];
    } catch (err) {
      console.log(err)
      // Alert.alert(err.toString());
    }
  }
}

interface SelectInterests {
  interest: string[];
}
