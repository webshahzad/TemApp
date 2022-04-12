//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'
import { Bool } from 'common/constants'

interface BloodPressure {
  systolic: number
  diastolic: number
}

interface BiomarkerPanel {
  ldl: number,
  ldh: number,
  hdl: number,
  cholesterol: number,
  hba1c: number,
  triglycerides: number
}

export class BiomarkerPillar extends ObservableObject {
  bmi: number = 0
  body_fat: number = 0
  blood_pressure_obj: BloodPressure = {
    systolic: 0,
    diastolic: 0,
  }
  resting_heart_rate: number = 0
  v02_max: number = 0
  waist_circumference: number = 0
  panel_completed: number = Bool.False
  panel: BiomarkerPanel = {
    ldl: 0,
    ldh: 0,
    hdl: 0,
    cholesterol: 0,
    hba1c: 0,
    triglycerides: 0,
  }
  self_assessment: number = 0
  happyness_index: number = 0 // typo in API
  nutrition_tracker_value: number = 0
  nutrition_tracker_status: number = Bool.False
}
