//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { transaction, monitor } from 'reactronic'
import { Monitors } from 'models/app/Monitors'
import { Api, ApiData } from 'models/app/Api'
import { Refreshable } from 'common/Refreshable'

export class UserRadar extends Refreshable {
  socialScore: number = 0
  medicalScore: number = 0
  physicalActivityScore: number = 0
  mentalScore: number = 0
  nutritionScore: number = 0
  cardiovascularScore: number = 0
  averageSocialScore: number = 0
  averageMedicalScore: number = 0
  averagePhysicalActivityScore: number = 0
  averageMentalScore: number = 0
  averageNutritionScore: number = 0
  averageCardiovascularScore: number = 0

  @transaction @monitor(Monitors.Loading)
  protected async refresh(): Promise<void> {
    const response = await Api.call<ApiData>('GET', 'radar')
    this.apply(response.data)
  }
}
