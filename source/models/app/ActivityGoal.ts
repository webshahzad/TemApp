//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

// see iphone\TemApp\Model\Tem\ActivityModel.swift (enum ActivityType),
// see activities data in api\app\version1.1\activity_type\activity.data.js
export enum ActivityGoal {
  Distance = 1,
  Duration = 2,
  Open = 3,
}

export namespace ActivityGoal {
  const strings = {
    [ActivityGoal.Distance]: 'Distance',
    [ActivityGoal.Duration]: 'Duration',
    [ActivityGoal.Open]: 'Open',
  }

  export function toString(goal: ActivityGoal): string {
    return strings[goal]
  }
}
