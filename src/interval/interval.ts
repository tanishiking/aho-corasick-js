export class Interval {
  constructor(readonly start: number, readonly end: number) {}

  equals(other: Interval): boolean {
    return this.start === other.start && this.end === other.end
  }

  size(): number {
    return this.end - this.start + 1
  }
}
