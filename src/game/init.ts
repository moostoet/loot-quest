import { createWorld, addEntity, addComponent, pipe } from "bitecs";
import { Subject } from "rxjs";
import { SpawnUpdate, createSpawnSystem } from "./systems/spawn";
import { createTimeSystem } from "./systems/time";

export const initialiseWorld = () => {
    const world = createWorld({
        delta: 0,
        elapsed: 0,
        then: performance.now(),
    });
    const gameUpdates = new Subject<SpawnUpdate>();

    const pipeline = pipe(createTimeSystem(), createSpawnSystem(gameUpdates));

    setInterval(() => pipeline(world), 1000/60);

    return gameUpdates;
};
