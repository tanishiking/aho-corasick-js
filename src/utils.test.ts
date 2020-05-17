import { isAlphaNumeric } from './utils'

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
