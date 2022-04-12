//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

export interface Exercise {
  readonly _id: string
  readonly text: string
  readonly type: ExerciseType
  readonly doneBefore: boolean
}

export enum ExerciseType {
  InRealLife = 'InRealLife',
  Journal = 'Journal',
}
