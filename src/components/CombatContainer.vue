<template>
  <div class="flex flex-row gap-3">
    <div>
      <p>
        {{ player?.stats }}
      </p>
    </div>
    <div v-if="enemy">
      <p>
        {{ MonsterNames[enemy.type] }}
        {{ enemy.stats }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { get, set } from '@vueuse/core'
import { filter, Observer, Subject } from 'rxjs'
import { cond, pathEq, propEq, T } from 'ramda'

import { Player } from '../typings/interfaces/player'
import { Enemy } from '../typings/interfaces/enemy'
import { GameUpdate, initialiseWorld } from '../game/init'
import { SpawnUpdate } from '../typings/types/updates/spawn'
import { MonsterNames } from '../typings/types/monsterTypes'
import Monster from '../game/components/monster'
import { CombatUpdateBase } from '../typings/types/updates/combat'
import { CombatUpdate } from '../game/systems/combat'
import { PlayerUpdate } from '../game/systems/player'

const gameSubject = initialiseWorld()

const enemy = ref<Enemy | null>(null)

const player = ref<Player | null>(null)

// const updateEnemy = (update: SpawnUpdate) => {
//     console.log("updateEnemy");
//     const enemyData = {
//         type: update.type,
//         stats: update.stats,
//     };
//     //reverse update.type to string and set to parsed enemy name
//     set(enemy, enemyData);
// };

//create updateEnemy fn, but make it an observer

const pipeBySource =
  <U extends GameUpdate, S extends GameUpdate['source']>(source: S) =>
  (observer: Observer<GameUpdate>) => {
    return gameSubject
      .pipe(filter((u): u is U => u.source === source))
      .subscribe(observer)
  }

// const handleUpdate = cond([
//     [propEq("source", "spawn"), updateEnemy],
//     [propEq("source", "combat"), updateCombat],
// ]);

// const GameStateSubscriber: Observer<GameUpdate> = {
//     next(update) {
//         console.log("update ", update);
//         handleUpdate(update);
//     },
//     error() {
//         console.log("error");
//     },
//     complete() {
//         console.log("complete");
//     },
// };

const updatePlayer: Observer<PlayerUpdate> = {
  next(update) {
    console.log('playerUpdate: ', update)
    const playerData = {
      id: update.id,
      stats: update.stats
    }
    set(player, playerData)
  },
  error() {
    console.log('error')
  },
  complete() {
    console.log('complete')
  }
}

const updateEnemy: Observer<SpawnUpdate> = {
  next(update) {
    // console.log('enemyUpdate ', update)
    const enemyData = {
      type: update.type,
      stats: update.stats
    }
    //reverse update.type to string and set to parsed enemy name
    set(enemy, enemyData)
  },
  error() {
    console.log('error')
  },
  complete() {
    console.log('complete')
  }
}

const updateCombat: Observer<CombatUpdate> = {
  next(update) {
    // console.log(update);
    if (update.type === 'attack') {
      const enemyData = {
        type: get(enemy)?.type,
        stats: update.defenderStats
      }
      const playerData = {
        id: get(player)?.id,
        stats: update.attackerStats
      }
      set(enemy, enemyData)
      set(player, playerData)
    }
  },
  error() {
    console.log('error')
  },
  complete() {
    console.log('complete')
  }
}

onMounted(() => {
  console.log('mounted')
  // @ts-expect-error
  pipeBySource<PlayerUpdate, 'player'>('player')(updatePlayer)
  // @ts-expect-error
  pipeBySource<SpawnUpdate, 'spawn'>('spawn')(updateEnemy)
  // @ts-expect-error
  pipeBySource<CombatUpdate, 'combat'>('combat')(updateCombat)
})
</script>
