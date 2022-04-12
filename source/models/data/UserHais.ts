//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { monitor, transaction } from 'reactronic'
import { Monitors } from 'models/app/Monitors'
import { Api, ApiData } from 'models/app/Api'
import { Refreshable } from 'common/Refreshable'

export class UserHais extends Refreshable {
  activity_log_point_total: number = 0
  biomarker_pillar_score: number = 0
  nutrition_score: number = 0
  sum: number = 0

  @transaction
  protected async refresh(): Promise<void> {
    const response = await Api.call<ApiData<any>>('GET', 'users/haisTotalScore')
    this.apply(response) // data is returned directly in response object
  }
}
