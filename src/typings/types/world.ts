import { Time } from './Time'
import { Turn } from './turn'

export interface GameWorld {
  time: Time
  turn: Turn
}
