import type { AlertButton } from 'react-native'

type TClear = () => void

interface IAlertOptions {
  negativeOrClear?: AlertButton | TClear
  neutralOrCanCopy?: AlertButton | boolean
  title?: string
}

export type { IAlertOptions, TClear }
