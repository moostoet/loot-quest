import { IStats } from '../../interfaces/stats'
import { MonsterList } from '../monsterTypes'
import { UpdateBase } from './base'

export type SpawnUpdate = UpdateBase<
'spawn',
{
  type: MonsterList
  stats: IStats
}
>
