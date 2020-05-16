import { Interval } from './interval/interval'

export class Emit extends Interval {
  constructor(readonly start: number, readonly end: number, readonly keyword: string) {
    super(start, end)
  }
}
