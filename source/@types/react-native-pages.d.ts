declare module 'react-native-pages' {

  import { RefObject } from 'react'
  import { StyleProp, ViewStyle } from 'react-native'
  import Animated from 'react-native-reanimated'

  interface PagesProps {
    horizontal?: boolean
    rtl?: boolean
    startPage?: number
    indicatorColor?: string
    indicatorOpacity?: number
    indicatorPosition?: 'none' | 'top' | 'right' | 'bottom' | 'left'
    containerStyle?: StyleProp<ViewStyle>
    progress?: Animated.Value<any>
    onScrollStart?: () => void
    onScrollEnd?: () => void
    onHalfway?: () => void
    renderPager?: () => JSX.Element
  }

  export class Pages extends React.Component<PagesProps & { ref: RefObject<Pages> }> {
    scrollToPage(p: number): void
    isDragging(): boolean
    isDecelerating(): boolean

    activeIndex: number
  }

  export interface PagesPage {
    index: number
    pages: number
    progress: Animated.Value<any>
  }
}
