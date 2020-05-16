import { Interval } from './interval'

describe('Interval', () => {
  describe('euqals', () => {
    test('identity', () => {
      const x = new Interval(0, 1)
      expect(x.equals(x)).toBeTruthy()
    })

    test('intervals that have same start and end should be equal', () => {
      const x = new Interval(0, 1)
      const y = new Interval(0, 1)
      expect(x.equals(y)).toBeTruthy()
    })

    test('intervals that have different start and end should not be equal', () => {
      const x = new Interval(0, 1)
      const y = new Interval(0, 2)
      expect(x.equals(y)).toBeFalsy()
    })
  })

  describe('size', () => {
    test('should be end - start + 1', () => {
      const y = new Interval(0, 2)
      expect(y.size()).toBe(3)
    })
  })
})
