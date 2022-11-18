export const MonsterTypes = {
    'goblin': 0,
    'orc': 1,
} as const;

export type MonsterTypes = typeof MonsterTypes[keyof typeof MonsterTypes];

export const MonsterNames: Record<MonsterTypes, string> = {
    [MonsterTypes.goblin]: 'Goblin',
    [MonsterTypes.orc]: 'Orc',
}