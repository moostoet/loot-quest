import { addComponent, defineQuery, exitQuery } from 'bitecs'
import { TurnUpdateBase } from '../../typings/types/updates/turn'
import { Turn } from '../../typings/types/turn'
import { GameWorld } from '../../typings/types/world'
import Monster from '../components/monster'
import Player from '../components/player'
import { everyDelta } from '../util/everyDelta'
import Active from '../components/turn'

export interface TurnData {
  current: number
}

export type TurnUpdate = TurnUpdateBase<'next', TurnData>

export const createInitialTurn = (): Turn => ({
  current: 1,
  count: 0
})

const nextTurn = (
  world: GameWorld,
  player: number,
  monsters: number[],
  turn: number
): TurnData => {
  console.log(turn)
  if (turn === undefined) turn = 1

  if (turn === monsters[0]) {
    turn = player
    addComponent(world, Active, player)
  } else {
    turn = monsters[0]
    addComponent(world, Active, monsters[0])
  }

  const turnData: TurnData = {
    current: turn
  }

  return turnData
}

export function createTurnSystem (): (world: GameWorld) => [] {
  const playerQuery = defineQuery([Player])
  const monsterQuery = defineQuery([Monster])
  const activeQuery = defineQuery([Active])
  const exitedActiveQuery = exitQuery(activeQuery)
  const shouldRun = everyDelta(1750)

  return (world: GameWorld) => {
    if (!shouldRun()) return []
    const player = playerQuery(world)[0]
    const monsters = monsterQuery(world)
    const exitedActive = exitedActiveQuery(world)

    nextTurn(world, player, monsters, exitedActive[0])
    return []
  }
}
