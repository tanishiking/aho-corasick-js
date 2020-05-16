/**
 * Configuration
 */
export interface TrieConfig {
  allowOverlaps: boolean
  onlyWholeWords: boolean
  // onlyWholeWordsWhiteSpaceSeparated: boolean
  caseInsensitive: boolean
  // stopOnHit: boolean
}

export const defaultConfig: TrieConfig = {
  allowOverlaps: true,
  onlyWholeWords: false,
  // onlyWholeWordsWhiteSpaceSeparated: false,
  caseInsensitive: false,
  // stopOnHit: false,
}
