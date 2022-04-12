//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

export enum Gender {
  None = 0,
  Male = 1,
  Female = 2,
  Other = 3,
}

export function getDefaultWeightByGender(gender: Gender): number {
  let result = 120
  if (gender === Gender.Female)
    result = 100
  else if (gender === Gender.Male)
    result = 140
  return result
}
