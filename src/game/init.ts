import { createWorld } from 'bitecs'
import { mergeWith, Observable, of } from 'rxjs'
import { reactivecs } from 'reactivecs'
import { CombatUpdate, createCombatSystem } from './systems/combat'
import { createInitialPlayer, createPlayerSystem, PlayerUpdate } from './systems/player'
import { SpawnUpdate, createSpawnSystem } from './systems/spawn'
import { createInitialTime, createTimeSystem } from './systems/time'
import { createInitialTurn, createTurnSystem } from './systems/turn'

export type GameUpdate = CombatUpdate | SpawnUpdate | PlayerUpdate

export const initialiseWorld = (): Observable<GameUpdate> => {
  const world = createWorld({
    time: createInitialTime(),
    turn: createInitialTurn()
  })

  const updates = reactivecs(
    [
      createTimeSystem(),
      createPlayerSystem(),
      createSpawnSystem(),
      createTurnSystem(),
      createCombatSystem()
    ],
    world,
    1000 / 60
  )

  const initialPlayer = createInitialPlayer(world)
  return updates.pipe(mergeWith(of(initialPlayer)))
}
