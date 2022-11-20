export const MonsterTypes = {
  goblin: 0,
  orc: 1
} as const

export type MonsterList = typeof MonsterTypes[keyof typeof MonsterTypes]

export const MonsterNames: Record<MonsterList, string> = {
  [MonsterTypes.goblin]: 'Goblin',
  [MonsterTypes.orc]: 'Orc'
}
