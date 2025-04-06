import type { ReadonlyDeep } from 'type-fest'
import type {
  ICaptureParams,
  IMoment,
  ISliceData,
  ISpanCalculationContext,
  IToStringParams,
  TId
} from './types'

import { isArray, isString, isUndefined } from 'radashi'
import { verify } from 'simple-common-utils'

import { BaseDataCapturingService } from '../BaseDataCapturingService'

class PerformanceCounter extends BaseDataCapturingService {
  private readonly moments = new Map<TId, Readonly<IMoment>>()

  override clear(): void {
    this.moments.clear()
  }

  override show(params?: ReadonlyDeep<IToStringParams>): void {
    this.alert(this.toString(params))
  }

  override toString(params?: ReadonlyDeep<IToStringParams>): string {
    const { slices } = PerformanceCounter.getNormalizedToStringParams(params)
    const slicesArray = isArray(slices) ? slices : [slices]

    return slicesArray
      .map(slice => {
        const { ids, shouldCalculateSpan } =
          PerformanceCounter.getNormalizedSliceData(slice)

        try {
          const moments = this.getMoments(ids)

          if (shouldCalculateSpan) {
            const { previousMoment, span } =
              moments.reduce<ISpanCalculationContext>(
                (context, currentMoment) => {
                  if (context.previousMoment) {
                    context.span +=
                      currentMoment.timestamp - context.previousMoment.timestamp
                  }

                  context.previousMoment = currentMoment

                  return context
                },
                { previousMoment: undefined, span: 0 }
              )

            return `${previousMoment?.message}\n\t\t${Math.round(span)} ms`
          }

          return moments
            .map(({ message, timestamp }, index, array) => {
              // eslint-disable-next-line @typescript-eslint/no-magic-numbers
              const previousTimestamp = array[index - 1]?.timestamp ?? timestamp
              const durationMS = timestamp - previousTimestamp
              const duration = durationMS ? `${Math.round(durationMS)} ms` : '-'

              return `${message}\n\t\t${duration}`
            })
            .join('\n\n')
        } catch (error) {
          return (error as Error).message
        }
      })
      .join('\n\n')
  }

  capture(captureParamsOrMessage: Readonly<ICaptureParams> | string): void {
    const captureParams =
      isString(captureParamsOrMessage) ?
        {
          message: captureParamsOrMessage
        }
      : captureParamsOrMessage

    const {
      id = Math.random(),
      idCollisionPolicy = 'fail',
      message = id.toString(),
      shouldCapture = true,
      shouldClear = false
    } = captureParams

    if (!shouldCapture) {
      return
    }

    if (shouldClear) {
      this.clear()
    }

    if (this.moments.has(id)) {
      switch (idCollisionPolicy) {
        case 'fail':
          throw new Error(
            `${this.constructor.name}.capture(): id <${id.toString()}> was already used`
          )

        case 'dontAdd':
          return
      }
    }

    this.moments.set(id, {
      ...captureParams,
      id,
      message,
      timestamp: performance.now()
    })
  }

  hasMoment(id: TId): boolean {
    return this.moments.has(id)
  }

  private getMoments(ids: readonly TId[]): readonly Readonly<IMoment>[] {
    if (!ids.length) {
      return Array.from(this.moments.values())
    }

    const moments = ids.map(id => {
      const moment = this.moments.get(id)

      verify(
        moment,
        `${this.constructor.name}: no moment with id <${id.toString()}>`
      )

      return moment
    })

    for (let index = 1; index < moments.length; ++index) {
      const currentMoment = moments[index]
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const previousMoment = moments[index - 1]

      verify(currentMoment, `${this.constructor.name}: no moment at [${index}]`)

      verify(
        previousMoment,
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        `${this.constructor.name}: no moment at [${index - 1}]`
      )

      verify(
        previousMoment.timestamp <= currentMoment.timestamp,
        `${this.constructor.name}: id <${previousMoment.id.toString()}> (${previousMoment.message}) did not take place before id <${currentMoment.id.toString()}> (${currentMoment.message})`
      )
    }

    return moments
  }

  private static getNormalizedSliceData(
    sliceData: ReadonlyDeep<ISliceData>
  ): ReadonlyDeep<Required<ISliceData>> {
    const { ids = [] } = sliceData

    let { shouldCalculateSpan } = sliceData

    if (isUndefined(shouldCalculateSpan)) {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      shouldCalculateSpan = ids.length > 1
    }

    return {
      ids,
      shouldCalculateSpan
    }
  }

  private static getNormalizedToStringParams(
    params: ReadonlyDeep<IToStringParams> = {}
  ): ReadonlyDeep<Required<IToStringParams>> {
    const { slices = {} } = params

    return { slices }
  }
}

const performanceCounter = new PerformanceCounter()

export { PerformanceCounter, performanceCounter }
