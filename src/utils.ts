/**
 * Convert string to character array
 *
 * @param str - string to split.
 */
export function stringToArray(str: string): string[] {
  const arr = []
  for (let i = 0; i < str.length; i++) {
    arr.push(str.substr(i, 1))
  }
  return arr
}

export function isAlphaNumeric(str: string): boolean {
  const len = str.length
  for (let i = 0; i < len; i++) {
    const code = str.charCodeAt(i)
    if (
      !(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123) // lower alpha (a-z)
    ) {
      return false
    }
  }
  return true
}
