import {
  defineQuery,
  addEntity,
  addComponent,
  IWorld
} from 'bitecs'
import type { IStats } from '../../typings/interfaces/stats'
import { MonsterList, MonsterTypes } from '../../typings/types/monsterTypes'
import { UpdateBase } from '../../typings/types/updates/base'
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
  Stats.maxHealth[entity] = stats.maxHealth
  Stats.currentHealth[entity] = stats.currentHealth
  Stats.attack[entity] = stats.attack
  Stats.armor[entity] = stats.armor
  Stats.maxShields[entity] = stats.maxShields
  Stats.currentShields[entity] = stats.currentShields
}

const spawn = (world: IWorld): SpawnData => {
  const spawnData: SpawnData = {
    type: MonsterTypes.goblin,
    stats: {
      maxHealth: 10,
      currentHealth: 10,
      attack: 2,
      armor: 0,
      maxShields: 0,
      currentShields: 0
    }
  }

  spawnMonster(spawnData.type, spawnData.stats, world)

  return spawnData
}

export function createSpawnSystem (): (world: GameWorld) => SpawnUpdate[] {
  const monsterQuery = defineQuery([Monster])
  const shouldRun = everyDelta(1000)

  return (world: GameWorld) => {
    const updates: SpawnUpdate[] = []

    if (!shouldRun()) return []
    const monsters = monsterQuery(world)
    if (monsters.length === 0) {
      const { type, stats } = spawn(world)
      updates.push({
        source: 'spawn',
        type,
        stats
      })
    }
    return updates
  }
}
