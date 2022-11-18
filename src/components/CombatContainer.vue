<template>
    <div v-if="enemy">
        <p>
            {{ MonsterNames[enemy.type] }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { get, set } from "@vueuse/core";
import { filter, Observer, Subject } from "rxjs";
import { cond, propEq, T } from "ramda";

import { Enemy } from "../typings/interfaces/enemy";
import { initialiseWorld } from "../game/init";
import { SpawnUpdate } from "../typings/types/updates/spawn";
import { MonsterNames } from "../typings/types/monsterTypes";
import Monster from "../game/components/monster";

const gameSubject = initialiseWorld();

const enemy = ref<Enemy | null>(null);

const parsedEnemyName = ref<string>("");

const updateEnemy = (update: SpawnUpdate) => {
    console.log("updateEnemy");
    const enemyData = {
        type: update.type,
        stats: update.stats,
    };
    //reverse update.type to string and set to parsed enemy name
    set(enemy, enemyData);
};

const handleUpdate = cond([
    [propEq("source", "spawn"), updateEnemy],
    [T, console.log.bind(console)],
]);

const GameStateSubscriber: Observer<SpawnUpdate> = {
    next(update) {
        console.log("update ", update);
        handleUpdate(update);
    },
    error() {
        console.log("error");
    },
    complete() {
        console.log("complete");
    },
};

onMounted(() => {
    console.log("mounted");
    gameSubject.subscribe(GameStateSubscriber);
});
</script>
