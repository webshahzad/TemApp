//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { cached, ObservableObject, unobservable, transaction, reaction } from 'reactronic'
import { ReactiveCellContent, ReactiveCellCustomization, ReactiveHoneycombManager } from 'components/ReactiveHoneycomb/ReactiveHoneycombManager'
import GoalIcon from 'assets/icons/achievement/achievement.png'
import ChallengeIcon from 'assets/icons/challenge/challenge.png'
import HoneycombImage from 'assets/images/top-layer/top-layer.png'
import CalendarImage from 'assets/images/dashboard/small-calendar.png'
import SocialImage from 'assets/images/dashboard/tems.png'
import TargetImage from 'assets/images/dashboard/target.png'
import LeaderboardImage from 'assets/images/dashboard/leaderboard.png'
import { NotificationGradient, DefaultHexGradient } from 'common/constants'
import { HoneyCombType } from 'models/app/ExtraHoneyCombs'
import { populate } from 'common/populate'
import { create } from 'common/create'
import { ReportFlag } from 'models/data/UserReport'
import { toFixedPadded } from 'common/number'
import { StackNavigationProp } from '@react-navigation/stack'
import { DashboardStackPropsPerPath } from 'navigation/params'
import { HexPatternStrokeColor } from 'components/Theme'
import { AppModel } from '../App'
import { showCalendar } from 'screens/calendar/Calendar'
import { MindfulnessIcon } from './DashboardParts'
import ProfileImage from 'assets/images/dashboard/user.png'

export class Dashboard extends ObservableObject {
  @unobservable private readonly app: AppModel
  @unobservable readonly honeycomb: ReactiveHoneycombManager
  navigation?: StackNavigationProp<DashboardStackPropsPerPath, 'Dashboard'> = undefined

  constructor(app: AppModel) {
    super()
    this.app = app
    this.honeycomb = new ReactiveHoneycombManager()
    populate(this.honeycomb.props, {
      columns: 3,
      arrangement: 'centerCellToCenter',
      stroke: HexPatternStrokeColor,
      strokeWidth: 2,
      textColor: 'white',
      contentImageWidth: 35,
    })
  }

  @transaction
  saveNavigation(navigation: StackNavigationProp<DashboardStackPropsPerPath, 'Dashboard'>): void {
    this.navigation = navigation
  }

  @reaction
  protected initExtraCombs(): void {
    const extraCells = this.getExtraCells()
    // this assignment initiates re-rendering of ReactiveHoneycomb and resets center tile background
    // after screen transition (fix #34)
    this.honeycomb.props.cells = []
    if (extraCells.length > 0) {
      const indexesForExtra: number[] = this.getIndexesForExtra()
      for (let i = 0; i < extraCells.length && i < indexesForExtra.length; i++) {
        const customCellIndex = indexesForExtra[i]
        this.honeycomb.props.cells[customCellIndex] = extraCells[i]
      }
    }
  }

  @cached
  private getExtraCells(): ReactiveCellCustomization[] {
    const result = this.app.user.extraHoneyCombs.data.map(h => {
      const isGoal = (h.type === HoneyCombType.Goal)
      const isChallenge = (h.type === HoneyCombType.Challenge)
      const name = (isChallenge ? 'CHALLENGE:\n' : '') + h.name + ((isGoal && h.goalPercent !== undefined) ? `\n${h.goalPercent}%` : '')
      const extraCell = create(ReactiveCellCustomization, {
        content: create(ReactiveCellContent, {
          backgroundGradient: DefaultHexGradient,
          image: isGoal ? GoalIcon : isChallenge ? ChallengeIcon : SocialImage,
          h2: name,
          stroke: 'white',
          strokeWidth: 4,
          fitStroke: true,
        }),
      })
      if (isGoal) {
        extraCell.onPress = async () => {
          await this.app.goalsAndChallenges.openGoalDetails(h.id, null)
        }
      }
      else if (isChallenge) {
        extraCell.onPress = async () => {
          await this.app.goalsAndChallenges.openChallengeDetails(h.id, null)
        }
      }
      else { // Tem
        extraCell.onPress = async () => {
          await this.app.openChat(h.id)
        }
      }
      return extraCell
    })
    return result
  }

  private getIndexesForExtra(): number[] {
    const result: number[] = []
    const columns = this.honeycomb.props.columns
    const rowsAbove = this.honeycomb.rowsAboveCenterCount
    let first: number = columns * (rowsAbove - CenterHeightInRows + 1)
    for (let i = 0; i < columns; i++)
      result.push(first + i)
    first = first + (columns * (CenterHeightInRows + 1))
    for (let i = 0; i < columns; i++)
      result.push(first + i)
    return result
  }

  @reaction
  protected initCenterNeighborCells(): void {
    const user = this.app.user.stored
    const userAvatar = ((user !== undefined) && user.profile_pic) ? { uri: user.profile_pic } : undefined
    const userIcon = userAvatar ? undefined : ProfileImage

    this.honeycomb.props.centerNeighbors = [
      create(ReactiveCellCustomization, {
        content: create(ReactiveCellContent, {
          backgroundImage: HoneycombImage,
          stroke: '#4392df',
          fitStroke: true,
        }),
        backSideContent: create(ReactiveCellContent, {
          backgroundGradient: DefaultHexGradient,
          stroke: 'white',
          fitStroke: true,
          strokeWidth: 4,
          h1: toFixedPadded(this.app.user.hais.sum, 1, 2),
          h2: 'HAIS',
        }),
      }),
      create(ReactiveCellCustomization, {
        onPress: () => {
          this.app.openGoalsAndChallenges()
        },
        content: create(ReactiveCellContent, {
          backgroundGradient: DefaultHexGradient,
          image: TargetImage,
          h2: 'Goals &\nChallenges',
        }),
      }),
      create(ReactiveCellCustomization, {
        onPress: () => {
          this.app.rootNavigation.push('ActivityLog')
        },
        content: create(ReactiveCellContent, {
          backgroundColor: ReportFlag.color(this.app.user.report.totalActivityReport.totalActivityScore.flag),
          image: ReportFlag.icon(this.app.user.report.totalActivityReport.totalActivityScore.flag),
          h1: this.app.user.report.totalActivityReport.totalActivityScore.value !== undefined ?
            toFixedPadded(this.app.user.report.totalActivityReport.totalActivityScore.value, 1, 2) :
            undefined,
          h2: 'Activity score', 
        }),
      }),
      create(ReactiveCellCustomization, {
        onPress: () => {
          void this.app.openProfileTemates()
        },
        content: create(ReactiveCellContent, {
          backgroundGradient: DefaultHexGradient,
          image: userIcon,
          avatar: userAvatar,
          h2: 'Profile &\nTēmates',
        }),
      }),
      create(ReactiveCellCustomization, {
        onPress: showCalendar,
        content: create(ReactiveCellContent, {
          backgroundGradient: DefaultHexGradient,
          image: CalendarImage,
          h2: 'Calendar',
        }),
      }),
      create(ReactiveCellCustomization, {
        onPress: async () => {
          this.app.rootNavigation.push('Leaderboard')
        },
        content: create(ReactiveCellContent, {
          backgroundGradient: DefaultHexGradient,
          image: LeaderboardImage,
          h2: 'Leaderboard',
        }),
      }),
      create(ReactiveCellCustomization, {
        onPress: () => {
          this.app.bottomTabsNavigation?.navigate('Social')
        },
        content: create(ReactiveCellContent, {
          backgroundGradient: DefaultHexGradient,
          image: SocialImage,
          h2: 'Social',
        }),
      }),
    ]
  }

}

const CenterHeightInRows: number = 3
