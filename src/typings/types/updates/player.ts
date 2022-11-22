import { UpdateBase } from './base'

export type PlayerUpdateBase<T, D = {}> = UpdateBase<'player', D & { type: T }>
