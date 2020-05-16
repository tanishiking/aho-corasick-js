import { IntervalNode } from './interval-node'
import { Interval } from './interval'

export class IntervalTree {
  private rootNode: IntervalNode

  constructor(intervals: Interval[]) {
    this.rootNode = new IntervalNode(intervals)
  }

  removeOverlaps<T extends Interval>(intervals: T[]): T[] {
    const removedIntervals: Interval[] = []

    // sort by size descending so that intervals that has larger size should survive over that smaller ones.
    intervals
      .sort((a, b) => b.size() - a.size())
      .forEach((current) => {
        if (!this.containsInterval(removedIntervals, current)) {
          const overlaps = this.rootNode.findOverlaps(current)
          overlaps.forEach((overlap) => {
            if (!this.containsInterval(removedIntervals, overlap)) removedIntervals.push(overlap)
          })
        }
      })

    // sort by position ascend
    return intervals
      .sort((a, b) => a.start - b.start)
      .filter((interval) => {
        return !this.containsInterval(removedIntervals, interval)
      })
  }

  private containsInterval(intervals: Interval[], interval: Interval): boolean {
    return intervals.some((current) => current.equals(interval))
  }
}
