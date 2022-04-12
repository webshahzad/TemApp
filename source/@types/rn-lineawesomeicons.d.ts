declare module 'rn-lineawesomeicons' {
  import { StyleProp, ViewStyle } from 'react-native'

  const Icon: (props: {
    icon: string
    height?: number
    width?: number
    fill?: string
    stroke?: string
    style?: StyleProp<ViewStyle>
  }) => React.ReactElement
  export default Icon
}
