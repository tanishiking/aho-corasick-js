// TODO Impelement Ascii State that has fixed length HashMap
//      https://github.com/hankcs/aho-corasick/blob/master/src/main/java/org/ahocorasick/trie/AsciiState.java
export class State {
  private _failure: State | null = null
  private rootState: State | null = null

  private readonly _depth: number
  private _emits: string[] = []

  private success: Map<string, State> = new Map()

  constructor(depth: number) {
    this._depth = depth
    this.rootState = depth === 0 ? this : null
  }

  get failure(): State | null {
    return this._failure
  }

  set failure(state: State | null) {
    this._failure = state
  }

  get depth(): number {
    return this._depth
  }

  get emits(): string[] {
    return this._emits
  }

  /**
   * Add outputs to the state.
   *
   * @param keywords the list of outputs.
   */
  addEmits(keywords: string[]): void {
    this._emits.push(...keywords)
  }

  /**
   * Transit to the next state with the given character.
   *
   * @param char input character for the transition.
   */
  nextState(char: string, ignoreRootState: boolean = false): State | null {
    const nextState: State | undefined = this.success.get(char)
    if (nextState) {
      return nextState
    } else if (!ignoreRootState && typeof nextState === 'undefined' && this.rootState !== null) {
      return this.rootState
    } else {
      return null
    }
  }

  /**
   * Create a new state and add a transition to the new state
   * with the given character.
   *
   * @param char input character for moving to the new state.
   */
  addState(char: string): State {
    const nextState: State | null = this.nextState(char, true) // ignore root state
    if (nextState === null) {
      const newState = new State(this.depth + 1)
      this.success.set(char, newState)
      return newState
    } else {
      return nextState
    }
  }

  /**
   * Return the list of reachable states with one step.
   */
  getStates(): State[] {
    return Array.from(this.success.values())
  }

  /**
   * Get the possible char to move to the next state.
   */
  getTransitions(): string[] {
    return Array.from(this.success.keys())
  }
}
