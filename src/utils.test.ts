import { stringToArray, isAlphaNumeric } from './utils'

describe('stringToArray', () => {
  test('white space', () => {
    expect(stringToArray(' abc')).toEqual([' ', 'a', 'b', 'c'])
    expect(stringToArray('   ')).toEqual([' ', ' ', ' '])
  })

  test('count unicode char as 2', () => {
    expect(stringToArray('𩸽love')).toHaveLength(6)
  })
})

describe('isAlphaNumeric', () => {
  test('[0-9A-Za-z]', () => {
    expect(isAlphaNumeric('a')).toBeTruthy()
    expect(isAlphaNumeric('A')).toBeTruthy()
    expect(isAlphaNumeric('0')).toBeTruthy()

    expect(isAlphaNumeric('abcsyz')).toBeTruthy()
    expect(isAlphaNumeric('ABCZYZ')).toBeTruthy()
    expect(isAlphaNumeric('009')).toBeTruthy()
    expect(isAlphaNumeric('abcABC012')).toBeTruthy()

    expect(isAlphaNumeric(' ')).toBeFalsy()
    expect(isAlphaNumeric('a c')).toBeFalsy()
    expect(isAlphaNumeric('@')).toBeFalsy()
  })
})
