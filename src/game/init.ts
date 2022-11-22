import { createWorld, pipe } from 'bitecs'
import { Subject } from 'rxjs'
import { reactivecs } from 'reactivecs'
import { CombatUpdate, createCombatSystem } from './systems/combat'
import { createPlayerSystem } from './systems/player'
import { SpawnUpdate, createSpawnSystem } from './systems/spawn'
import { createTimeSystem } from './systems/time'
import { createTurnSystem } from './systems/turn'

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

const createInitialTurn = (): {
  current: number
  count: number
} => ({
  current: 1,
  count: 0
})

export const initialiseWorld = (): Subject<GameUpdate> => {
  const world = createWorld({
    time: createInitialTime(),
    turn: createInitialTurn()
  })

  // const player = addEntity(world)
  // addComponent(world, Player, player)
  // addComponent(world, Stats, player)
  // Stats.health[player] = 100
  // Stats.attack[player] = 1
  // Stats.armor[player] = 0
  // Stats.shields[player] = 0

  const gameUpdates = new Subject<GameUpdate>()

  const pipeline = pipe(
    createTimeSystem(),
    // @ts-expect-error
    createPlayerSystem(gameUpdates),
    // @ts-expect-error
    createSpawnSystem(gameUpdates),
    createTurnSystem(),
    // @ts-expect-error
    createCombatSystem(gameUpdates)
  )

  // const systemObs = reactivecs([createTimeSystem()], world, 1000 / 60)

  // reactivecs()

  setInterval(() => pipeline(world), 1000 / 60)

  return gameUpdates
}
