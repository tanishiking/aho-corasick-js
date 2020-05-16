# @tanishiking/aho-corasick

TypeScript implementation of the Aho-Corasick algorithm for efficient string matching

![CI](https://github.com/tanishiking/aho-corasick-js/workflows/CI/badge.svg)

## Install

```
yarn add @tanishiking/aho-corasick
```

## Usage

```typescript
import { Trie, Emit } from '@tanishiking/aho-corasick'
const trie = new Trie(['hers', 'his', 'she', 'he'])
const emits: Emit[] = trie.parseText('ushers')
console.log(emits)
// [ Emit { start: 1, end: 3, keyword: 'she' },
//   Emit { start: 2, end: 3, keyword: 'he' },
//   Emit { start: 2, end: 5, keyword: 'hers' } ]
```

### Options

#### caseInsensitive (default: false)

If `caseInsensitive` is true, find keywords case insensitively.

```typescript
import { Trie } from '@tanishiking/aho-corasick'
const trie = new Trie(['hers', 'his', 'she', 'he'], {
  caseInsensitive: false,
})
const emits = trie.parseText('usHErs')
console.log(emits)
// []

const trie = new Trie(['hers', 'his', 'she', 'he'], {
  caseInsensitive: true,
})
const emits = trie.parseText('usHErs')
console.log(emits)
// [ Emit { start: 1, end: 3, keyword: 'she' },
//   Emit { start: 2, end: 3, keyword: 'he' },
//   Emit { start: 2, end: 5, keyword: 'hers' } ]
```

#### allowOverlaps (default: true)

If `allowOverlaps` is false, filter out overlaps from match result. Longer keywords have larger priority for filtering overlaps.

```typescript
const trie = new Trie(['ab', 'cba', 'ababc'], { allowOverlaps: true })
const emits = trie.parseText('ababcbab')
console.log(emits)
// [ Emit { start: 0, end: 1, keyword: 'ab' },
//  Emit { start: 2, end: 3, keyword: 'ab' },
//  Emit { start: 0, end: 4, keyword: 'ababc' },
//  Emit { start: 4, end: 6, keyword: 'cba' },
//  Emit { start: 6, end: 7, keyword: 'ab' } ]

const trie = new Trie(['ab', 'cba', 'ababc'], { allowOverlaps: false })
const emits = trie.parseText('ababcbab')
console.log(emits)
// [ Emit { start: 0, end: 4, keyword: 'ababc' },
//   Emit { start: 6, end: 7, keyword: 'ab' } ]
```

#### onlyWholeWords (default: false)

If `onlyWholeWords` is true, only keywords surrounded by alphanumerical characters would match.
This option work correctly only if words are separated by non-alphanumerical term like English.

```typescript
const trie = new Trie(['sugar'], { onlyWholeWords: false })
const emits = trie.parseText('sugarcane sugarcane sugar canesugar')
console.log(emits)
// [ Emit { start: 0, end: 4, keyword: 'sugar' },
//   Emit { start: 10, end: 14, keyword: 'sugar' },
//   Emit { start: 20, end: 24, keyword: 'sugar' },
//   Emit { start: 30, end: 34, keyword: 'sugar' } ]

const trie = new Trie(['sugar'], { onlyWholeWords: true })
const emits = trie.parseText('sugarcane sugarcane sugar canesugar')
console.log(emits)
// [ Emit { start: 20, end: 24, keyword: 'sugar' } ]
```
