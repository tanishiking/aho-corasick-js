import { Trie } from './trie'

describe('Trie', () => {
  describe('parseText', () => {
    test('keyword and text are the same', () => {
      const trie = new Trie(['abc'])
      const emits = trie.parseText('abc')
      expect(emits).toHaveLength(1)
      expect(emits[0]).toEqual({
        end: 2,
        start: 0,
        keyword: 'abc',
      })
    })

    test('test is longer than keyword', () => {
      const trie = new Trie(['abc'])
      const emits = trie.parseText(' abc')
      expect(emits).toHaveLength(1)
      expect(emits[0]).toEqual({
        end: 3,
        start: 1,
        keyword: 'abc',
      })
    })

    test('various keywords one match', () => {
      const trie = new Trie(['abc', 'bcd', 'cde'])
      const emits = trie.parseText('bcd')
      expect(emits).toHaveLength(1)
      expect(emits[0]).toEqual({
        end: 2,
        start: 0,
        keyword: 'bcd',
      })
    })

    test('ushers test', () => {
      const trie = new Trie(['hers', 'his', 'she', 'he'])
      const emits = trie.parseText('ushers')
      expect(emits).toHaveLength(3) // she @ 3, he @ 3, hers @ 5
      expect(emits[0]).toEqual({
        start: 1,
        end: 3,
        keyword: 'she',
      })
      expect(emits[1]).toEqual({
        start: 2,
        end: 3,
        keyword: 'he',
      })
      expect(emits[2]).toEqual({
        start: 2,
        end: 5,
        keyword: 'hers',
      })
    })

    // TODO pressure test

    test('misleading test', () => {
      const trie = new Trie(['hers'])
      const emits = trie.parseText('h he her hers')
      expect(emits).toHaveLength(1)
      expect(emits[0]).toEqual({
        start: 9,
        end: 12,
        keyword: 'hers',
      })
    })

    test('recipes', () => {
      const trie = new Trie(['veal', 'cauliflower', 'broccoli', 'tomatoes'])
      const emits = trie.parseText('2 cauliflowers, 3 tomatoes, 4 slices of veal, 100g broccoli')
      expect(emits).toHaveLength(4)
      const sorted = emits.sort((a, b) => a.start - b.start)
      expect(sorted[0]).toEqual({
        start: 2,
        end: 12,
        keyword: 'cauliflower',
      })
      expect(sorted[1]).toEqual({
        start: 18,
        end: 25,
        keyword: 'tomatoes',
      })
      expect(sorted[2]).toEqual({
        start: 40,
        end: 43,
        keyword: 'veal',
      })
      expect(sorted[3]).toEqual({
        start: 51,
        end: 58,
        keyword: 'broccoli',
      })
    })

    test('long and short overlapping', () => {
      const trie = new Trie(['he', 'hehehehe'])
      const emits = trie.parseText('hehehehehe')
      const sorted = emits.sort((a, b) => a.start - b.start)
      expect(sorted[0]).toEqual({
        start: 0,
        end: 1,
        keyword: 'he',
      })
      expect(sorted[1]).toEqual({
        start: 0,
        end: 7,
        keyword: 'hehehehe',
      })
      expect(sorted[2]).toEqual({
        start: 2,
        end: 3,
        keyword: 'he',
      })
      expect(sorted[3]).toEqual({
        start: 2,
        end: 9,
        keyword: 'hehehehe',
      })
      expect(sorted[4]).toEqual({
        start: 4,
        end: 5,
        keyword: 'he',
      })
      expect(sorted[5]).toEqual({
        start: 6,
        end: 7,
        keyword: 'he',
      })
      expect(sorted[6]).toEqual({
        start: 8,
        end: 9,
        keyword: 'he',
      })
    })

    test('non-overlapping', () => {
      const trie = new Trie(['ab', 'cba', 'ababc'], { allowOverlaps: false })
      const emits = trie.parseText('ababcbab')
      expect(emits).toHaveLength(2)
      expect(emits[0]).toEqual({
        start: 0,
        end: 4,
        keyword: 'ababc',
      })
      expect(emits[1]).toEqual({
        start: 6,
        end: 7,
        keyword: 'ab',
      })
    })

    test('start of Churchill speech', () => {
      const keywords = ['T', 'u', 'ur', 'r', 'urn', 'ni', 'i', 'in', 'n', 'urning']
      const trie = new Trie(keywords, { allowOverlaps: false })
      const emits = trie.parseText('Turning')
      expect(emits).toHaveLength(2)
    })

    test('bug5InGithubReportedByXCurry', () => {
      const trie = new Trie(['turning', 'once', 'again', 'börkü'], { caseInsensitive: true, onlyWholeWords: true })
      const emits = trie.parseText('TurninG OnCe AgAiN BÖRKÜ')
      expect(emits).toHaveLength(4)
      expect(emits[0]).toEqual({
        start: 0,
        end: 6,
        keyword: 'turning',
      })
      expect(emits[1]).toEqual({
        start: 8,
        end: 11,
        keyword: 'once',
      })
      expect(emits[2]).toEqual({
        start: 13,
        end: 17,
        keyword: 'again',
      })
      expect(emits[3]).toEqual({
        start: 19,
        end: 23,
        keyword: 'börkü',
      })
    })

    test('case-insensitive', () => {
      const trie = new Trie(['turning', 'once', 'again', 'börkü'], { caseInsensitive: true })
      const emits = trie.parseText('TurninG OnCe AgAiN BÖRKÜ')
      expect(emits).toHaveLength(4)
      expect(emits[0]).toEqual({
        start: 0,
        end: 6,
        keyword: 'turning',
      })
      expect(emits[1]).toEqual({
        start: 8,
        end: 11,
        keyword: 'once',
      })
      expect(emits[2]).toEqual({
        start: 13,
        end: 17,
        keyword: 'again',
      })
      expect(emits[3]).toEqual({
        start: 19,
        end: 23,
        keyword: 'börkü',
      })
    })

    test('partial match', () => {
      const trie = new Trie(['sugar'], { onlyWholeWords: true })
      const emits = trie.parseText('sugarcane sugarcane sugar canesugar')
      expect(emits).toHaveLength(1)
      expect(emits[0]).toEqual({
        start: 20,
        end: 24,
        keyword: 'sugar',
      })
    })

    // Test offered by dwyerk, https://github.com/robert-bor/aho-corasick/issues/8
    test('unicode string: issue 8', () => {
      const target = 'LİKE THIS' // The second character ('İ') is Unicode, which was read by AC as a 2-byte char
      const trie = new Trie(['this'], { caseInsensitive: true })
      expect(target.substring(5, 9)).toBe('THIS') // Java does it the right way

      const emits = trie.parseText(target)
      expect(emits).toHaveLength(1)
      expect(emits[0]).toEqual({
        start: 5,
        end: 8,
        keyword: 'this',
      })
    })

    test('unicode string', () => {
      const target = '𩸽 LOVE' // The first characrer ('𩸽') is Unicode
      const trie = new Trie(['𩸽'])
      expect(target.substring(0, 2)).toBe('𩸽')

      const emits = trie.parseText(target)
      expect(emits).toHaveLength(1)
      expect(emits[0]).toEqual({
        start: 0,
        end: 1,
        keyword: '𩸽',
      })
    })

    test('contains unicode string', () => {
      const target = '𩸽 LOVE' // The first characrer ('𩸽') is Unicode
      const trie = new Trie(['LOVE'])
      expect(target.substring(3, 7)).toBe('LOVE')

      const emits = trie.parseText(target)
      expect(emits).toHaveLength(1)
      expect(emits[0]).toEqual({
        start: 3,
        end: 6,
        keyword: 'LOVE',
      })
    })
  })
})
