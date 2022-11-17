import { MonsterTypes } from "../types/monsterTypes";
import { IStats } from "./stats";

export interface Enemy {
    type: MonsterTypes,
    stats: IStats,
}