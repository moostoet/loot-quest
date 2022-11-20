import { defineQuery, defineSystem, System } from 'bitecs'
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

const doCombatTurn = (attacker: number, defender: number, world: GameWorld): void => {
  Stats.health[defender] -= Stats.attack[attacker]
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

  doCombatTurn(attacker, defender, world)

  return combatData
}

export function createCombatSystem (gameSubject: Subject<CombatUpdate>): System<[], GameWorld> {
  const monsterQuery = defineQuery([Monster])
  const playerQuery = defineQuery([Player])
  const combatSubject: Subject<CombatUpdate> = new Subject()
  gameSubject.subscribe(combatSubject)

  return defineSystem(
    everyDelta(1000, (world) => {
      const monsters = monsterQuery(world)
      const player = playerQuery(world)

      if (monsters.length > 0 && player.length > 0) {
        const { attacker, defender } = combat(world, player[0], monsters[0])
        combatSubject.next({
          source: 'combat',
          attacker,
          defender,
          type: 'attack'
        })
      }
      console.log(world)
    })
  )
}
