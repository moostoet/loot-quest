export const MonsterTypes = {
    'goblin': 0,
    'orc': 1,
} as const;

export type MonsterTypes = typeof MonsterTypes[keyof typeof MonsterTypes];