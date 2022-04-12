//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import * as RN from 'react-native'

declare module 'react-native' {
  interface ImagePropsBase {
    tintColor?: RN.ColorValue
  }
}
