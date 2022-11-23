import { addComponent, addEntity, defineQuery } from 'bitecs'
import { IStats } from '../../typings/interfaces/stats'
import { PlayerUpdateBase } from '../../typings/types/updates/player'
import { GameWorld } from '../../typings/types/world'
import { Player as PlayerC } from '../components/player'
import Stats from '../components/stats'
import { everyDelta } from '../util/everyDelta'
// import Player from '../components/player'

export interface PlayerData {
  id: number
  stats: IStats
}

export type PlayerUpdate =
  | PlayerUpdateBase<'stats', PlayerData>
  | PlayerUpdateBase<'init', PlayerData>

export const createInitialPlayer = (world: GameWorld): PlayerUpdate => {
  const playerQuery = defineQuery([PlayerC])
  return {
    source: 'player',
    type: 'init',
    id: playerQuery(world)[0],
    stats: {
      maxHealth: 100,
      currentHealth: 100,
      attack: 3,
      armor: 0,
      maxShields: 0,
      currentShields: 0
    }
  }
}

const addPlayer = (world: GameWorld): void => {
  const player = addEntity(world)
  addComponent(world, PlayerC, player)
  addComponent(world, Stats, player)
  Stats.maxHealth[player] = 100
  Stats.currentHealth[player] = 100
  Stats.attack[player] = 3
  Stats.armor[player] = 0
  Stats.maxShields[player] = 0
  Stats.currentShields[player] = 0
}

export function createPlayerSystem (): (world: GameWorld) => PlayerUpdate[] {
  const playerQuery = defineQuery([PlayerC])
  const shouldRun = everyDelta(1750)

  return (world: GameWorld) => {
    const updates: PlayerUpdate[] = []

    if (!shouldRun()) return []
    const players = playerQuery(world)
    if (players.length > 0) {
      console.log('player exists')
    } else {
      addPlayer(world)
      updates.push({
        source: 'player',
        type: 'init',
        id: players[0],
        stats: {
          maxHealth: Stats.maxHealth[players[0]],
          currentHealth: Stats.currentHealth[players[0]],
          attack: Stats.attack[players[0]],
          armor: Stats.armor[players[0]],
          maxShields: Stats.maxShields[players[0]],
          currentShields: Stats.currentShields[players[0]]
        }
      })
    }
    return updates
  }
}
