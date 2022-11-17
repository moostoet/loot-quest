import { IStats } from "../../interfaces/stats";
import { MonsterTypes } from "../monsterTypes";
import { UpdateBase } from "./base";

export type SpawnUpdate = UpdateBase<
    "spawn",
    {
        type: MonsterTypes;
        stats: IStats;
    }
>;