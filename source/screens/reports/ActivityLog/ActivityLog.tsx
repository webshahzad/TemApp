//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { PropsWithChildren } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { Honeycomb } from 'components/Honeycomb/Honeycomb'
import { HexPatternStrokeColor } from 'components/Theme'
import { CellCustomization, HoneycombArrangement } from 'components/Honeycomb/HoneycombProps'
import { toFixedPadded } from 'common/number'
import { App } from 'models/app/App'
import { ReportFlag } from 'models/data/UserReport'
import { reactive } from 'common/reactive'
import { ActivityGraph } from './ActivityGraph'
import { ActivityReport } from './ActivityReport'
import { ChallengesReport, GoalsReport } from './GoalsAndChallengesReport'
import { HelpModal, HelpModalManager } from './HelpModal'
import { Transaction } from 'reactronic'

export function ActivityLog(): React.ReactElement {
  return reactive(() => {
    const modalManager = Transaction.run(() => new HelpModalManager())

    const honeycombCells: CellCustomization[] = []
    honeycombCells[3] = {
      backgroundColor: ReportFlag.color(App.user.report.totalActivityReport.totalActivityScore.flag),
      content: {
        image: ReportFlag.icon(App.user.report.totalActivityReport.totalActivityScore.flag),
        h1: App.user.report.totalActivityReport.totalActivityScore.value !== undefined ?
          toFixedPadded(App.user.report.totalActivityReport.totalActivityScore.value, 1, 2) :
          undefined,
        h2: 'Activity score',
      },
      helpOnPress: () => modalManager.showModal(),
    }

    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <Honeycomb
            style={styles.honeycomb}
            columns={3}
            arrangement='cover'
            heightShift={-0.25}
            stroke={HexPatternStrokeColor}
            strokeWidth={2}
            textColor='white'
            contentImageWidth={35}
            cells={honeycombCells}
          />
          <Card style={styles.firstCard}>
            <ActivityGraph userReport={App.user.report} />
          </Card>
          <Card>
            <ActivityReport />
          </Card>
          <Card>
            <ChallengesReport />
          </Card>
          <Card>
            <GoalsReport />
          </Card>
        </ScrollView>
        <HelpModal
          manager={modalManager}
        />
      </SafeAreaView>
    )
  })
}

function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>): React.ReactElement {
  return (
    <View style={[style, styles.card]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    height: '100%',
  },
  content: {
    minHeight: 200,
  },

  honeycomb: {
    ...StyleSheet.absoluteFillObject,
  },

  card: {
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    // shadow generator: https://ethercreative.github.io/react-native-shadow-generator/
    elevation: 3,         // shadow for android
    shadowColor: '#000',  // shadow for ios (incl. following styles)
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  firstCard: {
    marginTop: 200,
  },
})
