import { defineQuery, defineSystem } from "bitecs";
import { GameWorld } from "../../typings/types/world";

export function createTimeSystem() {
    return defineSystem<[], GameWorld>((world) => {
        const now = performance.now();
        const delta = now - world.time.then;
        world.time.delta = delta;
        world.time.elapsed += delta;
        world.time.then = now;
        console.log(world.time);
        return world;
    });
}
