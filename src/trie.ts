import { TrieConfig, defaultConfig } from './trie-config'
import { State } from './state'
import { Emit } from './emit'
import { stringToArray, isAlphaNumeric } from './utils'
import { IntervalTree } from './interval/interval-tree'

/**
 * Aho-Corasick implementation based on http://cr.yp.to/bib/1975/aho.pdf
 * Port of
 * robert-bor/aho-corasick https://github.com/robert-bor/aho-corasick and
 * hankcs/aho-corasick https://github.com/hankcs/aho-corasick
 */
export class Trie {
  private failureStateConstructed: boolean = false
  private readonly rootState: State = new State(0)
  private options: TrieConfig

  constructor(keywords?: string[], options?: Partial<TrieConfig>) {
    if (typeof keywords !== 'undefined' && keywords.length > 0) {
      keywords.forEach((keyword) => {
        this.addKeyword(keyword)
      })
    }
    if (options) {
      this.options = { ...defaultConfig, ...options }
    } else {
      this.options = defaultConfig
    }
  }

  addKeyword(keyword: string): void {
    if (keyword.length === 0) return
    let currentState = this.rootState
    stringToArray(keyword).forEach((char) => {
      currentState = currentState.addState(char)
    })
    currentState.addEmits([keyword])
  }

  /**
   * Find keywords from given text.
   *
   * @param text - The text to search for keywords.
   */
  parseText(text: string): Emit[] {
    this.checkForConstructedFailureStates()
    let pos = 0
    let currentState: State = this.rootState
    const collectedEmits: Emit[] = []

    stringToArray(text).forEach((originalChar) => {
      const char = this.options.caseInsensitive ? originalChar.toLowerCase() : originalChar
      currentState = this.getState(currentState, char)
      const emits = this.toEmits(pos, currentState)
      collectedEmits.push(...emits)
      pos++
    })

    // Filter out partial words.
    const emits = this.options.onlyWholeWords ? this.removePartialMatches(text, collectedEmits) : collectedEmits

    // Filter out overlaps, bigger size has larger priority.
    const filteredOverlaps = !this.options.allowOverlaps ? new IntervalTree(emits).removeOverlaps(emits) : emits

    return filteredOverlaps
  }

  /**
   * Jump to the next state, using both goto and failure.
   *
   * @param currentState - Current state.
   * @param char - Accepted character.
   * @returns Jumped state.
   */
  private getState(currentState: State, char: string): State {
    let state: State = currentState
    let newCurrentState: State | null = currentState.nextState(char)
    while (newCurrentState === null) {
      state = state.failure!
      newCurrentState = state.nextState(char)
    }
    return newCurrentState!
  }

  private checkForConstructedFailureStates(): void {
    if (!this.failureStateConstructed) {
      this.constructFailureStates()
    }
  }

  private constructFailureStates(): void {
    const queue: State[] = []

    this.rootState.failure = this.rootState
    this.rootState.getStates().forEach((depthOneState) => {
      depthOneState.failure = this.rootState
      queue.push(depthOneState)
    })

    while (queue.length > 0) {
      // cannot be undefined because queue.length > 0
      const currentState: State = queue.shift()!

      currentState.getTransitions().forEach((transition) => {
        // This can't be null
        const targetState: State = currentState.nextState(transition)!
        queue.push(targetState)
        let traceFailureState: State = currentState.failure!
        while (traceFailureState.nextState(transition) === null) {
          traceFailureState = traceFailureState.failure!
        }
        // cannot be null because traceFailure.nextState(transition) !== null here.
        const newFailureState = traceFailureState.nextState(transition)!
        targetState.failure = newFailureState
        targetState.addEmits(newFailureState.emits)
      })
    }

    this.failureStateConstructed = true
  }

  private removePartialMatches(searchText: string, emits: Emit[]): Emit[] {
    const start = searchText.length
    return emits.filter((emit) => {
      return (
        (emit.start === 0 || !isAlphaNumeric(searchText.charAt(emit.start - 1))) &&
        (emit.end + 1 == start || !isAlphaNumeric(searchText.charAt(emit.end + 1)))
      )
    })
  }

  private toEmits(end: number, currentState: State): Emit[] {
    const emits: string[] = currentState.emits
    return emits.map((emit) => {
      return new Emit(end - stringToArray(emit).length + 1, end, emit)
    })
  }
}

export { TrieConfig, defaultConfig, Emit }
