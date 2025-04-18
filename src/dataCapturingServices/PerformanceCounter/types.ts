import type { SetRequired } from 'type-fest'

type TId = number | string | symbol

interface ICaptureAndMomentCommonParams {
  id?: TId
  message?: string
}

type TCollisionPolicy = 'dontAdd' | 'fail'

interface ICaptureParams extends ICaptureAndMomentCommonParams {
  idCollisionPolicy?: TCollisionPolicy
  shouldCapture?: boolean
  shouldClear?: boolean
}

interface IMoment
  extends SetRequired<ICaptureAndMomentCommonParams, 'id' | 'message'> {
  timestamp: ReturnType<typeof performance.now>
}

type TRMoment = Readonly<IMoment>
type TRMoments = readonly TRMoment[]

interface ISpanCalculationContext {
  previousMoment: IMoment | undefined
  span: number
}

interface ISliceData {
  ids?: TId[]
  shouldCalculateSpan?: boolean
  title?: string
}

interface IToStringParams {
  slices?: ISliceData | ISliceData[]
}

export type {
  ICaptureParams,
  IMoment,
  ISliceData,
  ISpanCalculationContext,
  IToStringParams,
  TId,
  TRMoment,
  TRMoments
}
