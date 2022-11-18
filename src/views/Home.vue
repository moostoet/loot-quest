<template>
    <div class="container grid gap-3">
        <div>
            <p
                class="font-bold p-2 bg-slate-100 rounded-md border border-slate-300"
            >
                Welcome, [name]
            </p>
        </div>
		<CombatContainer/>
    </div>
</template>

<script setup lang="ts">
import CombatContainer from "../components/CombatContainer.vue";
</script>
