import { defineSystem, System } from 'bitecs'
import { GameWorld } from '../../typings/types/world'

export function createTimeSystem (): System<[], GameWorld> {
  return defineSystem<[], GameWorld>((world) => {
    const now = performance.now()
    const delta = now - world.time.then
    world.time.delta = delta
    world.time.elapsed += delta
    world.time.then = now
    return world
  })
}
