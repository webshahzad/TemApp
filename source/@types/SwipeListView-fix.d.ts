//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import * as SLV from 'react-native-swipe-list-view'

declare module 'react-native-swipe-list-view' {
  export interface SwipeListView<T> {
    scrollToOffset: (params: { animated?: boolean | null; offset: number }) => void
  }
}
