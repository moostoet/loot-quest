import {
    defineQuery,
    defineSystem,
    addEntity,
    addComponent,
    IWorld,
} from "bitecs";
import type { IStats } from "../../typings/interfaces/stats";
import { MonsterTypes } from "../../typings/types/monsterTypes";
import { UpdateBase } from "../../typings/types/updates/base";
import { Subject } from "rxjs";
import { isEmpty } from "ramda";
import Monster from "../components/monster";
import Stats from "../components/stats";
import { everyDelta } from "../util/everyDelta";

export interface SpawnData {
    type: MonsterTypes;
    stats: IStats;
}

export type SpawnUpdate = UpdateBase<"spawn", SpawnData>;

const spawnMonster = (monster: MonsterTypes, stats: IStats, world: IWorld) => {
    const entity = addEntity(world);
    addComponent(world, Monster, entity);
    addComponent(world, Stats, entity);
    Monster.type[entity] = monster;
    Stats.health[entity] = stats.health;
    Stats.attack[entity] = stats.attack;
    Stats.armor[entity] = stats.armor;
    Stats.shields[entity] = stats.shields;
};

const spawn = (world: IWorld): SpawnData => {
    const spawnData: SpawnData = {
        type: MonsterTypes.goblin,
        stats: {
            health: 10,
            attack: 2,
            armor: 0,
            shields: 0,
        },
    };

    spawnMonster(spawnData.type, spawnData.stats, world);

    return spawnData;
};

export function createSpawnSystem<S extends SpawnUpdate>(
    gameSubject: Subject<S>
) {
    const monsterQuery = defineQuery([Monster]);
    const spawnSubject = new Subject<SpawnUpdate>();
    //@ts-ignore
    spawnSubject.subscribe(gameSubject);

    return defineSystem(
        everyDelta(1000, (world) => {
            const monsters = monsterQuery(world);
            console.log("monsters: ", monsters);

            if (monsters.length === 0) {
                const { type, stats } = spawn(world);
                spawnSubject.next({
                    source: "spawn",
                    type,
                    stats,
                });
            }
        })
    );
}
