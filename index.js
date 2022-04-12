//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { AppRegistry, LogBox } from 'react-native'
import { AppWindow } from './source/AppWindow'
import { name as appName } from './app.json'

LogBox.ignoreLogs([
  'Require cycle: node_modules',
  'Require cycle: source\\models'
])

AppRegistry.registerComponent(appName, () => AppWindow)
