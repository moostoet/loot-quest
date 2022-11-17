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

export interface SpawnData {
    type: MonsterTypes;
    stats: IStats;
};

export type SpawnUpdate = UpdateBase<
    "spawn",
    SpawnData
>;

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
    }

    spawnMonster(
        spawnData.type,
        spawnData.stats,
        world
    );

    return spawnData;
};

export function createSpawnSystem(gameSubject: Subject<SpawnUpdate>) {
    const monsters = defineQuery([Monster]);
    const spawnSubject: Subject<SpawnUpdate> = new Subject();
    gameSubject.subscribe(spawnSubject);

    return defineSystem((world) => {
        const entities = monsters(world);

        if (isEmpty(entities)) {
            const { type, stats } = spawn(world);
            gameSubject.next({
                source: "spawn",
                type,
                stats
            });
        }
        return world;
    });
}
