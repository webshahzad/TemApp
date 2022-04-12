//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import 'react-native-gesture-handler'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import { reactive } from 'common/reactive'
import { Monitors } from 'models/app/Monitors'
import { RootStack } from 'navigation/RootStack'
import { LoadingIndicatorModal } from 'components/LoadingIndicatorModal'
import { ActionModal } from 'components/ActionModal'
import { ImageViewer } from 'components/ImageViewer'
import { TutorialModal } from 'components/Tutorial/TutorialModal'
import THoneyCombIcon from 'assets/icons/Tabs/t-honeycomb/t-honeycomb.png'
import { initApp } from 'models/app/App'

 
export function AppWindow(): JSX.Element {
  const [App] = React.useState(() => initApp())
  console.disableYellowBox = true;

  const linkingOptions: LinkingOptions = {
    prefixes: [
      'tem://'
    ],
    config: {
      screens: {
        Main: {
          initialRouteName: 'BottomTabs',
          screens: {
            BottomTabs: {
              screens: {
                ActivityTracking: {
                  path: 'activities',
                  screens: {
                    TrackActivity: 'track', // for 'tem://activities/track'
                  },
                },
              },
            },
          },
        },
        Post: {
          path: 'posts/detail',
        },
      },
    },
  }
  return reactive(() => {
    return (
      <SafeAreaProvider>
        <NavigationContainer linking={linkingOptions}>
          <RootStack />
        </NavigationContainer>

        <LoadingIndicatorModal hidden={!Monitors.Loading.isActive} />
        <ActionModal manager={App.actionModal} icon={THoneyCombIcon} />
        <ImageViewer manager={App.imageViewer} />
        <TutorialModal manager={App.tutorial} />
      </SafeAreaProvider>
    )
  })
}
