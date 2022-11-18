import { defineQuery, defineSystem } from "bitecs";
import { Subject } from "rxjs";
import { IStats } from "../../typings/interfaces/stats";
import { UpdateBase } from "../../typings/types/updates/base";
import Player from "../components/player";
import Stats from "../components/stats";

export interface PlayerData {
    stats: IStats;
}

export type PlayerUpdate = UpdateBase<"player", PlayerData>;

export function createPlayerSystem(gameSubject: Subject<PlayerUpdate>) {
    const playerQuery = defineQuery([Player]);
    const playerSubject: Subject<PlayerUpdate> = new Subject();
    playerSubject.subscribe(gameSubject);

    return defineSystem((world) => {
        console.log(world);

        return world;
    })

}
