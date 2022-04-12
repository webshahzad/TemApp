//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'

/// The parameters for the balanced health radar of the user
class HealthRadar extends ObservableObject {
  socialScore?: number = undefined
  medicalScore?: number = undefined
  physicalActivityScore?: number = undefined
  mentalScore?: number = undefined
  nutritionScore?: number = undefined
  cardiovascularScore?: number = undefined

  averageSocialScore?: number = undefined
  averageMedicalScore?: number = undefined
  averagePhysicalActivityScore?: number = undefined
  averageMentalScore?: number = undefined
  averageNutritionScore?: number = undefined
  averageCardiovascularScore?: number = undefined
}
