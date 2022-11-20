import { GameWorld } from "../../typings/types/world";

export const everyDelta = (delta: number, fn: (world: GameWorld) => any) => {
    let lastRun: number = -delta;
    return (world: GameWorld): GameWorld => {
        const now = performance.now();
        if (now - lastRun > delta) {
            lastRun = now;
            fn(world);
        }
        return world;
    };
};
