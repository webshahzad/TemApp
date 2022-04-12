//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { WebViewSource } from 'react-native-webview/lib/WebViewTypes'

export interface WebPageProps {
  source: WebViewSource
  title: string
  textZoom?: number
}
