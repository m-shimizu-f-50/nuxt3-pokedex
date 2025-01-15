<script setup lang="ts">
import { usePokemonStore } from '../../stores/pokemonStore';
import { useCounterStore } from '../../stores/counterStore';

const pokemonStore = usePokemonStore();
const { increment, decrement } = useCounterStore();

// ポケモンデータを取得
pokemonStore.fetchPokemons();
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">ポケモン名称一覧</h1>
		<ul>
			<li v-for="pokemon in pokemonStore.pokemons" :key="pokemon">
				{{ pokemon }}
			</li>
		</ul>

		<h1 class="text-2xl font-bold">カウンター</h1>
		<button @click="increment">+</button>
		<button @click="decrement">-</button>
		<button @click="useCounterStore().$reset()">Reset Store</button>
		<Counter />
	</div>
</template>
