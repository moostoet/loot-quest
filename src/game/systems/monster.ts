import { defineQuery, defineSystem, addEntity, addComponent, System, IWorld } from 'bitecs'
import { IStats } from '../../typings/interfaces/stats'

import Monster from '../components/monster'
import Stats from '../components/stats'

export function createMonsterSystem (type: number, stats: IStats): System<[], IWorld> {
  return defineSystem((world) => {
    const monster = addEntity(world)
    addComponent(world, Monster, monster)
    addComponent(world, Stats, monster)
    Monster.type[monster] = type
    Stats.health[monster] = stats.health
    Stats.attack[monster] = stats.attack
    Stats.armor[monster] = stats.armor
    Stats.shields[monster] = stats.shields
    return world
  })
}

export function getMonsterSystem (): System<[], IWorld> {
  const monsterQuery = defineQuery([Monster, Stats])

  return defineSystem((world) => {
    const entities = monsterQuery(world)

    console.log(entities)

    return world
  })
}
