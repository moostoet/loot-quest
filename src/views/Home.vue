<template>
    <div class="container grid gap-3">
        <div>
            <p
                class="font-bold p-2 bg-slate-100 rounded-md border border-slate-300"
            >
                Welcome, [name]
            </p>
        </div>
		<EnemySpawner/>
    </div>
</template>

<script setup lang="ts">
import EnemySpawner from "../components/EnemySpawner.vue";
</script>
