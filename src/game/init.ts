import { createWorld, addEntity, addComponent, pipe } from "bitecs";
import { Subject } from 'rxjs';
import Monster from "./components/monster";
import Stats from "./components/stats";
import { createMonsterSystem } from "./systems/monster";
import { SpawnUpdate, createSpawnSystem } from "./systems/spawn";

export const initialiseWorld = () => {
    const world = createWorld();
    const gameUpdates = new Subject<SpawnUpdate>();

    const pipeline = pipe(createSpawnSystem(gameUpdates));

    setInterval(() => pipeline(world), 666)

    return gameUpdates;
};
