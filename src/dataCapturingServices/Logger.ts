import { BaseDataCapturingService } from './BaseDataCapturingService'

class Logger extends BaseDataCapturingService {
  private readonly log: string[] = []

  override clear(): void {
    this.log.length = 0
  }

  override toString(): string {
    return this.log.join('\n')
  }

  add(string: string): void {
    this.log.push(string)
  }
}

export const logger = new Logger()
