import { createWorld, addEntity, addComponent, pipe } from 'bitecs'
import { Subject } from 'rxjs'
import Player from './components/player'
import Stats from './components/stats'
import { CombatUpdate, createCombatSystem } from './systems/combat'
import { SpawnUpdate, createSpawnSystem } from './systems/spawn'
import { createTimeSystem } from './systems/time'

export type GameUpdate = CombatUpdate | SpawnUpdate

const createInitialTime = (): {
  then: number
  delta: number
  elapsed: number
} => ({
  then: performance.now(),
  delta: 0,
  elapsed: 0
})

export const initialiseWorld = (): Subject<GameUpdate> => {
  const world = createWorld({
    time: createInitialTime()
  })

  const player = addEntity(world)
  addComponent(world, Player, player)
  addComponent(world, Stats, player)
  Stats.health[player] = 100
  Stats.attack[player] = 1
  Stats.armor[player] = 0
  Stats.shields[player] = 0

  const gameUpdates = new Subject<GameUpdate>()

  const pipeline = pipe(
    createTimeSystem(),
    // @ts-expect-error
    createSpawnSystem(gameUpdates),
    // @ts-expect-error
    createCombatSystem(gameUpdates)
  )

  setInterval(() => pipeline(world), 1000 / 60)

  return gameUpdates
}
