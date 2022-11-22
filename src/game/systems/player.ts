import { addComponent, addEntity, defineQuery, defineSystem, System } from 'bitecs'
import { Subject } from 'rxjs'
import { IStats } from '../../typings/interfaces/stats'
import { PlayerUpdateBase } from '../../typings/types/updates/player'
import { GameWorld } from '../../typings/types/world'
import Player from '../components/player'
import Stats from '../components/stats'
import { everyDelta } from '../util/everyDelta'
// import Player from '../components/player'

export interface PlayerData {
  id: number
  stats: IStats
}

export type PlayerUpdate = PlayerUpdateBase<'stats', PlayerData>

const addPlayer = (world: GameWorld): void => {
  const player = addEntity(world)
  addComponent(world, Player, player)
  addComponent(world, Stats, player)
  Stats.health[player] = 100
  Stats.attack[player] = 1
  Stats.armor[player] = 0
  Stats.shields[player] = 0
}

export function createPlayerSystem (
  gameSubject: Subject<PlayerUpdate>
): System<[], GameWorld> {
  //   const playerQuery = defineQuery([Player])
  const playerSubject: Subject<PlayerUpdate> = new Subject()
  const playerQuery = defineQuery([Player])
  playerSubject.subscribe(gameSubject)

  return defineSystem(
    everyDelta(1750, (world) => {
      const players = playerQuery(world)
      if (players.length > 0) {
        console.log('player exists')
      } else {
        addPlayer(world)
      }
      playerSubject.next({
        source: 'player',
        type: 'stats',
        id: players[0],
        stats: {
          health: Stats.health[players[0]],
          attack: Stats.attack[players[0]],
          armor: Stats.armor[players[0]],
          shields: Stats.shields[players[0]]
        }
      })
    })
  )
}
