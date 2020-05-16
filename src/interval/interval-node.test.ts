import { Interval } from './interval'
import { IntervalNode } from './interval-node'

describe('IntervalNode', () => {
  describe('findOverlaps', () => {
    const intervals = [
      new Interval(0, 2),
      new Interval(1, 3),
      new Interval(2, 4),
      new Interval(3, 5),
      new Interval(4, 6),
      new Interval(5, 7),
    ]
    const node = new IntervalNode(intervals)
    // median = 3

    test('left', () => {
      const overlaps = node.findOverlaps(new Interval(1, 2)).sort((a, b) => a.start - b.start)
      expect(overlaps).toHaveLength(3)
      expect(overlaps[0]).toEqual(new Interval(0, 2))
      expect(overlaps[1]).toEqual(new Interval(1, 3))
      expect(overlaps[2]).toEqual(new Interval(2, 4))
    })

    test('right', () => {
      const overlaps = node.findOverlaps(new Interval(5, 6)).sort((a, b) => a.start - b.start)
      expect(overlaps).toHaveLength(3)
      expect(overlaps[0]).toEqual(new Interval(3, 5))
      expect(overlaps[1]).toEqual(new Interval(4, 6))
      expect(overlaps[2]).toEqual(new Interval(5, 7))
    })

    test('interval', () => {
      const overlaps = node.findOverlaps(new Interval(1, 3)).sort((a, b) => a.start - b.start)
      expect(overlaps).toHaveLength(3)
      expect(overlaps[0]).toEqual(new Interval(0, 2))
      expect(overlaps[1]).toEqual(new Interval(2, 4))
      expect(overlaps[2]).toEqual(new Interval(3, 5))
    })

    test('do not contains itself', () => {
      const overlaps = node.findOverlaps(new Interval(5, 7)).sort((a, b) => a.start - b.start)
      expect(overlaps).toHaveLength(2)
      expect(overlaps[0]).toEqual(new Interval(3, 5))
      expect(overlaps[1]).toEqual(new Interval(4, 6))
    })
  })
})
