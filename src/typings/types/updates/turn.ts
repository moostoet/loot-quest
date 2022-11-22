import { UpdateBase } from './base'

export type TurnUpdateBase<T, D = {}> = UpdateBase<'turn', D & { type: T }>
