import { PerformanceCounter } from './PerformanceCounter'

const pool: Record<string, PerformanceCounter> = {}

export const getPerformanceCounter = (tag: string): PerformanceCounter => {
  if (!(tag in pool)) {
    pool[tag] = new PerformanceCounter()
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return pool[tag]!
}
