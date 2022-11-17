<template>
    <div v-if="enemy">
        {{ enemy }}
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { get, set } from "@vueuse/core";
import { filter, Observer, Subject } from 'rxjs';

import { Enemy } from "../typings/interfaces/enemy";
import { initialiseWorld } from '../game/init';
import { SpawnUpdate } from '../typings/types/updates/spawn';
import { cond, propEq, T } from 'ramda';

const gameSubject = initialiseWorld();

const enemy = ref<Enemy | null>(null);


const updateEnemy = (update: SpawnUpdate) => {
    console.log("test");
    const enemyData = {
        type: update.type,
        stats: update.stats,
    }
    set(enemy, enemyData);
}

const handleUpdate = cond([[propEq('source', 'spawn'), updateEnemy], [T, console.log.bind(console)]]);

const GameStateSubscriber: Observer<SpawnUpdate> = {
  next(update) {
    handleUpdate(update);
  },
  error(){
    console.log("error");
  },
  complete(){
    console.log("complete");
  }
}

onMounted(() => {
    console.log("mounted");
    gameSubject.subscribe(GameStateSubscriber);
});

</script>
