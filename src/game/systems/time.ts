import { Time } from '../../typings/types/Time'
import { GameWorld } from '../../typings/types/world'

export const createInitialTime = (): Time => {
  return {
    delta: 0,
    elapsed: 0,
    then: performance.now()
  }
}

export function createTimeSystem (): (world: GameWorld) => [] {
  return (world: GameWorld) => {
    const now = performance.now()
    const delta = now - world.time.then
    world.time.delta = delta
    world.time.elapsed += delta
    world.time.then = now
    return []
  }
}
