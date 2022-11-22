import {
  defineQuery,
  defineSystem,
  addEntity,
  addComponent,
  IWorld,
  System
} from 'bitecs'
import type { IStats } from '../../typings/interfaces/stats'
import { MonsterList, MonsterTypes } from '../../typings/types/monsterTypes'
import { UpdateBase } from '../../typings/types/updates/base'
import { Subject } from 'rxjs'
import Monster from '../components/monster'
import Stats from '../components/stats'
import { everyDelta } from '../util/everyDelta'
import { GameWorld } from '../../typings/types/world'

export interface SpawnData {
  type: MonsterList
  stats: IStats
}

export type SpawnUpdate = UpdateBase<'spawn', SpawnData>

const spawnMonster = (
  monster: MonsterList,
  stats: IStats,
  world: IWorld
): void => {
  const entity = addEntity(world)
  addComponent(world, Monster, entity)
  addComponent(world, Stats, entity)
  Monster.type[entity] = monster
  Stats.health[entity] = stats.health
  Stats.attack[entity] = stats.attack
  Stats.armor[entity] = stats.armor
  Stats.shields[entity] = stats.shields
}

const spawn = (world: IWorld): SpawnData => {
  const spawnData: SpawnData = {
    type: MonsterTypes.goblin,
    stats: {
      health: 10,
      attack: 2,
      armor: 0,
      shields: 0
    }
  }

  spawnMonster(spawnData.type, spawnData.stats, world)

  return spawnData
}

export function createSpawnSystem<S extends SpawnUpdate> (
  gameSubject: Subject<S>
): System<[], GameWorld> {
  const monsterQuery = defineQuery([Monster])
  const spawnSubject = new Subject<SpawnUpdate>()
  // @ts-expect-error
  spawnSubject.subscribe(gameSubject)

  return defineSystem(
    everyDelta(1000, (world) => {
      const monsters = monsterQuery(world)
      // console.log('monsters yesss: ', monsters)

      if (monsters.length === 0) {
        const { type, stats } = spawn(world)
        spawnSubject.next({
          source: 'spawn',
          type,
          stats
        })
      }
    })
  )
}
