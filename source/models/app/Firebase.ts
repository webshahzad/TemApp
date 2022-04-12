//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

void firestore().settings({
  ignoreUndefinedProperties: true,
})

export class Firebase {
  static chats = firestore().collection('Chats')
  static users = firestore().collection('Users')

  static storage = storage()
}
