//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'
import { UserInfo } from './UserInfo'

export class SearchResult extends ObservableObject {
  status?: number = undefined
  message?: string = undefined
  tematesByNameArray: Array<UserInfo> = []
  tematesByLocationArray: Array<UserInfo> = []
  tematesByGymArray: Array<UserInfo> = []
  tematesByInterestArray: Array<UserInfo> = []
  tematesByNameOthersArray: Array<UserInfo> = []
  tematesByLocationOthersArray: Array<UserInfo> = []
  tematesByGymOthersArray: Array<UserInfo> = []
  tematesByInterestOthersArray: Array<UserInfo> = []
  temsArray: Array<UserInfo> = []

  // See below how fields are populated
}

// init(_ dictionary: Parameters) {
//   status = dictionary["status"] as? Int
//   message = dictionary["message"] as? String ?? ""
//   if let data = dictionary["data"] as? Parameters {
//       if let people = data["people"] as? Parameters {
//           if let friends = people["friendsData"] as? [Parameters] {
//               tematesByNameArray = Friends.modelsFromDictionaryArray(array: friends)
//           }
//           if let others = people["othersData"] as? [Parameters] {
//               tematesByNameOthersArray = Friends.modelsFromDictionaryArray(array: others)
//           }
//       }
//       if let people = data["location"] as? Parameters {
//           if let friends = people["friendsData"] as? [Parameters] {
//               tematesByLocationArray = Friends.modelsFromDictionaryArray(array: friends)
//           }
//           if let others = people["othersData"] as? [Parameters] {
//               tematesByLocationOthersArray = Friends.modelsFromDictionaryArray(array: others)
//           }
//       }
//       if let people = data["interest"] as? Parameters {
//           if let friends = people["friendsData"] as? [Parameters] {
//               tematesByInterestArray = Friends.modelsFromDictionaryArray(array: friends)
//           }
//           if let others = people["othersData"] as? [Parameters] {
//               tematesByInterestOthersArray = Friends.modelsFromDictionaryArray(array: others)
//           }
//       }
//       if let people = data["gym"] as? Parameters {
//           if let friends = people["friendsData"] as? [Parameters] {
//               tematesByGymArray = Friends.modelsFromDictionaryArray(array: friends)
//           }
//           if let others = people["othersData"] as? [Parameters] {
//               tematesByGymOthersArray = Friends.modelsFromDictionaryArray(array: others)
//           }
//       }
//   }
// }
