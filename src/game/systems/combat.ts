import { defineQuery, hasComponent, removeComponent } from 'bitecs'
import { IStats } from '../../typings/interfaces/stats'
import { CombatUpdateBase } from '../../typings/types/updates/combat'
import { GameWorld } from '../../typings/types/world'
import Monster from '../components/monster'
import Player from '../components/player'
import Stats from '../components/stats'
import Active from '../components/turn'
import { everyDelta } from '../util/everyDelta'

export interface CombatData {
  attacker: number
  defender: number
  damage: number
  defenderStats: IStats
}

export interface CombatHealData {
  healer: number
  target: number
}

export interface CombatOutcomeData {
  winner: number
  loser: number
}

export type CombatUpdate =
  | CombatUpdateBase<'attack', CombatData>
  | CombatUpdateBase<'heal', CombatHealData>
  | CombatUpdateBase<'outcome', CombatOutcomeData>

const doCombatTurn = (
  attacker: number,
  defender: number,
  world: GameWorld
): CombatData => {
  const damage = Stats.attack[attacker] - Stats.armor[defender]
  if (Stats.currentHealth[defender] <= damage) {
    Stats.currentHealth[defender] = 0
    removeComponent(world, Monster, defender)
  } else {
    Stats.currentHealth[defender] -= damage
  }
  return {
    attacker,
    defender,
    damage,
    defenderStats: {
      maxHealth: Stats.maxHealth[defender],
      currentHealth: Stats.currentHealth[defender],
      attack: Stats.attack[defender],
      armor: Stats.armor[defender],
      maxShields: Stats.maxShields[defender],
      currentShields: Stats.currentShields[defender]
    }
  }
}

const combat = (
  world: GameWorld,
  playerE: number,
  monster: number
): CombatData => {
  const current = hasComponent(world, Active, playerE) ? playerE : monster
  const other = current === playerE ? monster : playerE
  removeComponent(world, Active, current)

  return doCombatTurn(current, other, world)
}

export function createCombatSystem (): (world: GameWorld) => CombatUpdate[] {
  const monsterQuery = defineQuery([Monster])
  const playerQuery = defineQuery([Player])
  const shouldRun = everyDelta(1750)

  return (world: GameWorld) => {
    if (!shouldRun()) return []
    const monsters = monsterQuery(world)
    const player = playerQuery(world)
    const updates: CombatUpdate[] = []

    if (monsters.length > 0 && player.length > 0) {
      updates.push({
        source: 'combat',
        type: 'attack',
        ...combat(world, player[0], monsters[0])
      })
      console.log('combat: ', updates)
    }
    return updates
  }
}
