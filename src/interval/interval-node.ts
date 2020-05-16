import { Interval } from './interval'

enum Direction {
  Right,
  Left,
}

/**
 * Binary tree to find all intervals that overlaps with the given interval efficiently.
 */
export class IntervalNode {
  private medianPoint: number
  private intervals: Interval[] = []
  private left: IntervalNode | null = null
  private right: IntervalNode | null = null

  /**
   *
   * @param intervals intervals, note that they should be sorted by size decending.
   */
  constructor(intervals: Interval[]) {
    this.medianPoint = this.determineMedian(intervals)

    const toLeft: Interval[] = []
    const toRight: Interval[] = []

    intervals.forEach((interval) => {
      if (interval.end < this.medianPoint) {
        toLeft.push(interval)
      } else if (this.medianPoint < interval.start) {
        toRight.push(interval)
      } else {
        this.intervals.push(interval)
      }
    })

    if (toLeft.length > 0) this.left = new IntervalNode(toLeft)
    if (toRight.length > 0) this.right = new IntervalNode(toRight)
  }

  /**
   * Find all intervals overlap with the given interval.
   *
   * @param interval - the interval object to find its overlaps.
   */
  findOverlaps(interval: Interval): Interval[] {
    if (this.medianPoint < interval.start) {
      const fromRightChild = this.right !== null ? this.right.findOverlaps(interval) : []
      const fromThisNode = this.checkForOverlaps(interval, Direction.Right)
      return fromRightChild.concat(fromThisNode).filter((current) => !interval.equals(current))
    } else if (interval.end < this.medianPoint) {
      const fromLeftChild = this.left !== null ? this.left.findOverlaps(interval) : []
      const fromThisNode = this.checkForOverlaps(interval, Direction.Left)
      return fromLeftChild.concat(fromThisNode).filter((current) => !interval.equals(current))
    } else {
      const fromRightChild = this.right !== null ? this.right.findOverlaps(interval) : []
      const fromLeftChild = this.left !== null ? this.left.findOverlaps(interval) : []
      return this.intervals
        .concat(fromRightChild)
        .concat(fromLeftChild)
        .filter((current) => !interval.equals(current))
    }
  }

  /**
   * Find the intervals that overlaps with the given interval (which never contains median point)
   * from the intervals of this node (which always contains median point).
   *                                  median
   *                ---------------------o---------------------
   * given interval ------[xxxxxxx]--------------[xxxxx]-------
   * current        ------------[xxxxxxxxxxxxxxxxxxx]----------
   *
   * @param interval - the interval to find its overlaps.
   * @param direction - the direction to search for.
   */
  private checkForOverlaps(interval: Interval, direction: Direction): Interval[] {
    return this.intervals.filter((current) => {
      if (direction === Direction.Left) return current.start <= interval.end
      else return current.end >= interval.start
    })
  }

  /**
   * Find a median point from left most start and right most ends.
   *
   * @param intervals
   */
  private determineMedian(intervals: Interval[]) {
    let start = -1
    let end = -1
    intervals.forEach((interval) => {
      const currentStart = interval.start
      const currentEnd = interval.end
      if (start === -1 || currentStart < start) {
        start = currentStart
      }
      if (end === -1 || currentEnd > end) {
        end = currentEnd
      }
    })
    return Math.floor((start + end) / 2)
  }
}
