import { alert } from '../alert'

export abstract class BaseDataCapturingService {
  abstract clear(): void
  abstract toString(): string

  show(): void {
    this.alert(this.toString())
  }

  protected alert(message: string): void {
    alert(message, { negativeOrClear: () => this.clear() })
  }
}
