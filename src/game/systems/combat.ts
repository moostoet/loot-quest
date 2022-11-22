import { defineQuery, defineSystem, removeComponent, System } from 'bitecs'
import { Subject } from 'rxjs'
import { CombatUpdateBase } from '../../typings/types/updates/combat'
import { GameWorld } from '../../typings/types/world'
import Monster from '../components/monster'
import Player from '../components/player'
import Stats from '../components/stats'
import { everyDelta } from '../util/everyDelta'

export interface CombatData {
  attacker: number
  defender: number
  playerStats?: {
    health: number
    attack: number
    armor: number
    shields: number
  }
  defenderStats?: {
    health: number
    attack: number
    armor: number
    shields: number
  }
  attackerStats?: {
    health: number
    attack: number
    armor: number
    shields: number
  }
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
): void => {
  const damage = Stats.attack[attacker] - Stats.armor[defender]
  if (Stats.health[defender] <= damage) {
    Stats.health[defender] = 0
    removeComponent(world, Monster, defender)
  } else {
    Stats.health[defender] -= damage
  }
}

const combat = (
  world: GameWorld,
  attacker: number,
  defender: number
): CombatData => {
  const combatData: CombatData = {
    attacker,
    defender
  }

  if (world.turn.current === attacker) {
    doCombatTurn(attacker, defender, world)
  } else {
    doCombatTurn(defender, attacker, world)
  }

  const newCombatData = {
    ...combatData,
    defenderStats: {
      health: Stats.health[defender],
      attack: Stats.attack[defender],
      armor: Stats.armor[defender],
      shields: Stats.shields[defender]
    },
    attackerStats: {
      health: Stats.health[attacker],
      attack: Stats.attack[attacker],
      armor: Stats.armor[attacker],
      shields: Stats.shields[attacker]
    }
  }

  return newCombatData
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
      const { attacker, defender, defenderStats, attackerStats } = combat(
        world,
        player[0],
        monsters[0]
      )

      updates.push({
        source: 'combat',
        type: 'attack',
        attacker,
        defender,
        defenderStats,
        attackerStats
      })
    }
    return updates
  }
}
