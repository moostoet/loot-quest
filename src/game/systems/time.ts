import { defineQuery, defineSystem } from "bitecs";

export function createTimeSystem() {
    return defineSystem((world) => {
        world.time = {
            delta: 0,
            elapsed: 0,
            then: performance.now(),
        };

        const { time } = world;
        const now = performance.now();
        const delta = now - time.then;
        time.delta = delta;
        time.elapsed += delta;
        time.then = now;
        return world;
    });
}
