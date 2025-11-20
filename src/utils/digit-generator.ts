export class ThreeDigitGenerator {
  private pool: string[];

  constructor() {
    // create ["000", "001", ..., "999"]
    this.pool = Array.from({ length: 1000 }, (_, i) =>
      i.toString().padStart(3, "0")
    );

    this.shuffle(this.pool);
  }

  private shuffle(arr: string[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  next(): string | null {
    return this.pool.pop() || null; // null when exhausted
  }
}
