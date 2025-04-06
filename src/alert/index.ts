import type { AlertButton } from 'react-native'
import type { ReadonlyDeep } from 'type-fest'
import type { IAlertOptions } from './types'

import { setStringAsync } from 'expo-clipboard'
import { isBoolean, isFunction, isString } from 'radashi'
import { Alert } from 'react-native'

export const alert = (
  message: string,
  optionsOrTitle: string | ReadonlyDeep<IAlertOptions> = ''
): void => {
  const buttons: AlertButton[] = []
  let title: string

  if (isString(optionsOrTitle)) {
    title = optionsOrTitle
  } else {
    title = optionsOrTitle.title ?? ''

    const { negativeOrClear, neutralOrCanCopy = true } = optionsOrTitle

    // neutralOrCanCopy
    if (!isBoolean(neutralOrCanCopy)) {
      buttons.push(neutralOrCanCopy)
    } else if (neutralOrCanCopy) {
      buttons.push({
        onPress: (): void => {
          const text = title ? `${title}\n\n${message}` : message

          void setStringAsync(text)
        },
        text: 'copy'
      })
    }

    // negativeOrClear
    if (negativeOrClear) {
      if (isFunction(negativeOrClear)) {
        buttons.push({
          onPress: negativeOrClear,
          text: 'clear'
        })
      } else {
        buttons.push(negativeOrClear)
      }
    }
  }

  buttons.push({})

  Alert.alert(title, message, buttons, { cancelable: true })
}
