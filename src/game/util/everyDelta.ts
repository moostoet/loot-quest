export const everyDelta = (delta: number): (() => boolean) => {
  let lastRun: number = -delta
  return (): boolean => {
    const now = performance.now()
    if (now - lastRun > delta) {
      lastRun = now
      return true
    }
    return false
  }
}
