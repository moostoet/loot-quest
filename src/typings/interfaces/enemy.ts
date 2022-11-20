import { MonsterList } from '../types/monsterTypes'
import { IStats } from './stats'

export interface Enemy {
  type: MonsterList
  stats: IStats
}
