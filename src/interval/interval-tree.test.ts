import { Interval } from './interval'
import { IntervalTree } from './interval-tree'

describe('IntervalTree', () => {
  describe('removeOverlaps', () => {
    test('remove all overlaps', () => {
      const intervals = [
        new Interval(0, 2),
        new Interval(4, 5),
        new Interval(2, 10),
        new Interval(6, 13),
        new Interval(9, 15),
        new Interval(12, 16),
      ]
      const intervalTree = new IntervalTree(intervals)
      const filtered = intervalTree.removeOverlaps(intervals)
      expect(filtered).toHaveLength(2)
      expect(filtered[0]).toEqual(new Interval(2, 10))
      expect(filtered[1]).toEqual(new Interval(12, 16))
    })
  })
})
