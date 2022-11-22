import { defineQuery, defineSystem, System } from 'bitecs'
import { TurnUpdateBase } from '../../typings/types/updates/turn'
import { GameWorld } from '../../typings/types/world'
import Monster from '../components/monster'
import Player from '../components/player'
import { everyDelta } from '../util/everyDelta'

export interface TurnData {
  current: number
  count: number
}

export type TurnUpdate = TurnUpdateBase<'next', TurnData>

const nextTurn = (
  world: GameWorld,
  player: number,
  monsters: number[]
): TurnData => {
  console.log(world.turn.current)
  if (world.turn.current === monsters[0]) {
    world.turn.current = player
    world.turn.count++
    console.log('Player turn ', world.turn)
  } else {
    world.turn.current = monsters[0]
    world.turn.count++
    console.log('Monster turn', world.turn)
  }
  const turnData: TurnData = {
    current: world.turn.current,
    count: world.turn.count
  }

  return turnData
}

export function createTurnSystem (): System<[], GameWorld> {
  const playerQuery = defineQuery([Player])
  const monsterQuery = defineQuery([Monster])

  return defineSystem(
    everyDelta(1750, (world) => {
      const player = playerQuery(world)[0]
      const monsters = monsterQuery(world)

      const { current, count } = nextTurn(world, player, monsters)
      console.log(current, count)
    })
  )
}
