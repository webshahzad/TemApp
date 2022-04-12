//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, unobservable, transaction, reaction, Transaction } from 'reactronic'
import { ViewStyle, ColorValue, ImageURISource, ImageRequireSource, LayoutChangeEvent, Animated, ImageSourcePropType } from 'react-native'
import { Color, NumberProp } from 'react-native-svg'
import { defineGrid, extendHex, Grid, Hex } from 'honeycomb-grid'
import { Gradient, HoneycombArrangement } from 'components/Honeycomb/HoneycombProps'

export class ReactiveHoneycombManager extends ObservableObject {
  props: ReactiveHoneycombProps = new ReactiveHoneycombProps()
  width: number = 0
  height: number = 0

  horizontalShift: number = 0
  verticalShift: number = 0
  top: number = 0
  exampleHex: Hex<{ size: number }> = extendHex({ size: 0 })()
  hexHeight: number = 0
  hexWidth: number = 0
  buildFitStrokePolygon: boolean = false
  cellSize: number = 0
  offset: number = 0

  grid: Grid<Hex<{ size: number }>> = defineGrid(extendHex({ size: 0 })).rectangle({ height: 0, width: 0 })

  cells: (CellState | undefined)[] = []

  get rowsAboveCenterCount(): number {
    return this.rowsAboveCenter
  }

  private rowsAboveCenter: number = 0

  @reaction
  protected init(): void {
    const { width, height } = this
    const columns = this.props.columns + 1

    this.cells = []

    this.cellSize = width / (columns - 1) / Math.sqrt(3)
    this.exampleHex = extendHex({ size: this.cellSize })()
    this.hexWidth = this.exampleHex.width()
    this.hexHeight = this.exampleHex.height()
    const rowsAboveCenter = Math.ceil((((height - this.hexHeight) / 2 / this.hexHeight) * 4) / 3)
    this.rowsAboveCenter = rowsAboveCenter
    const rowsBelowCenter = rowsAboveCenter + 1
    const centerCellIndex = rowsAboveCenter * columns + Math.floor(columns / 2)

    this.offset = this.props.shoveEvenRowRight ? 1 : -1
    const hexFactory = extendHex({ size: this.cellSize, offset: this.offset })
    const gridFactory = defineGrid(hexFactory)
    this.grid = gridFactory.rectangle({ height: rowsAboveCenter + 1 + rowsBelowCenter, width: columns })

    const centerCell = this.grid[centerCellIndex]
    if (this.grid.length > 0) {

      if (this.props.arrangement === 'cover') {
        if (!this.props.shoveEvenRowRight)
          this.horizontalShift = this.exampleHex.width() / 2
        this.verticalShift = this.exampleHex.height() / 4
      }
      else if (this.props.arrangement === 'centerCellToCenter') {
        const centerCellPosition = centerCell.toPoint().add(centerCell.center())
        this.horizontalShift = centerCellPosition.x - width / 2
        this.verticalShift = centerCellPosition.y - height / 2
      }

      if (this.props.heightShift !== undefined) {
        this.top = this.hexHeight * this.props.heightShift
      }

      if (this.props.cells) {
        for (let index = 0; index < this.props.cells.length; index++) {
          // there is an additional column in each row to cover entire container
          const indexFromStart = index + Math.floor(index / (columns - 1)) + 1
          const customization = this.props.cells[index]
          if (customization)
            this.cells[indexFromStart] = new CellState(customization)
        }
      }

      if (this.props.centerNeighbors) {
        const centerNeighbors = this.grid.neighborsOf(centerCell)
        for (let indexFromCenter = 0; indexFromCenter < this.props.centerNeighbors.length; indexFromCenter++) {
          let indexFromStart: number
          if (indexFromCenter === 0) {
            indexFromStart = centerCellIndex
          } else {
            const cell = centerNeighbors[indexFromCenter - 1]
            indexFromStart = columns * cell.y + cell.x
          }
          const customization = this.props.centerNeighbors[indexFromCenter]
          if (customization)
            this.cells[indexFromStart] = new CellState(customization)
        }
      }
    }

    this.buildFitStrokePolygon = this.cells.some(c => c?.customization?.content?.fitStroke || c?.customization?.backSideContent?.fitStroke)
  }

  @transaction
  onLayout(event: LayoutChangeEvent): void {
    this.width = event.nativeEvent.layout.width
    this.height = event.nativeEvent.layout.height
  }
}

export class ReactiveHoneycombProps extends ObservableObject {
  style?: ViewStyle = undefined
  columns: number = 0
  arrangement?: HoneycombArrangement = undefined
  heightShift?: number = undefined // in units of cell height
  shoveEvenRowRight?: boolean = undefined // see https://www.redblobgames.com/grids/hexagons/#coordinates-offset
  stroke?: Color = undefined
  strokeWidth?: NumberProp = undefined
  contentImageWidth?: number = undefined
  textColor?: ColorValue = undefined
  cells?: (ReactiveCellCustomization | undefined)[] | undefined = undefined
  centerNeighbors?: (ReactiveCellCustomization | undefined)[] | undefined = undefined
}

export class ReactiveCellCustomization extends ObservableObject {
  content?: ReactiveCellContent = undefined
  backSideContent?: ReactiveCellContent = undefined // does not support displaying images (incompatible with opacity animation and G component not applying opacity to ForeignObjects, see: https://github.com/react-native-community/react-native-svg/issues/1430). If images would be required in the future, scale animation should be used instead of opacity animation for switching cell sides.
  onPress?: () => void = undefined
  helpOnPress?: () => void = undefined
}

export class ReactiveCellContent extends ObservableObject {
  stroke?: Color = undefined
  strokeWidth?: NumberProp = undefined
  fitStroke?: boolean = undefined
  backgroundColor?: Color = undefined
  backgroundImage?: ImageURISource | ImageRequireSource = undefined
  backgroundGradient?: Gradient = undefined
  image?: ImageURISource | ImageRequireSource | number = undefined
  icon?: JSX.Element = undefined
  h1?: string = undefined
  h2?: string = undefined
  avatar?: ImageSourcePropType = undefined
}

export class CellState extends ObservableObject {
  customization: ReactiveCellCustomization
  cellFlipping?: CellFlipping = undefined

  constructor(customization: ReactiveCellCustomization) {
    super()
    this.customization = customization
    if (customization.backSideContent) {
      this.cellFlipping = new CellFlipping()
      customization.onPress = this.cellFlipping.flipSides
    }
  }
}

export class CellFlipping extends ObservableObject {
  @unobservable readonly frontSideOpacityAnimation: Animated.Value
  @unobservable readonly backSideOpacityAnimation: Animated.Value
  isFrontSide: boolean = true

  constructor() {
    super()
    this.frontSideOpacityAnimation = new Animated.Value(1)
    this.backSideOpacityAnimation = new Animated.Value(0)
  }

  @transaction
  flipSides(): void {
    const afterFlip = (): void => Transaction.run(() => {
      // update state after animation finished (fix #34)
      this.isFrontSide = !this.isFrontSide
    })
    if (this.isFrontSide)
      Animated.sequence([
        Animated.timing(this.frontSideOpacityAnimation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(this.backSideOpacityAnimation, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(afterFlip)
    else
      Animated.sequence([
        Animated.timing(this.backSideOpacityAnimation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(this.frontSideOpacityAnimation, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(afterFlip)
  }

}
