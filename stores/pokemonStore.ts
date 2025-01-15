import { defineStore } from 'pinia';
import { usePokemons } from '~/composables/pokemons';

export const usePokemonStore = defineStore('pokemon', {
	state: () => ({
		pokemons: [] as string[],
		isLoading: false,
	}),
	actions: {
		async fetchPokemons() {
			this.isLoading = true;
			const { pokemons } = await usePokemons();

			this.pokemons = pokemons.value.map((pokemon) => pokemon.name);
			this.isLoading = true;
		},
	},
});
