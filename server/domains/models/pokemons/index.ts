import z from 'zod';
import type { Pokemon as PokemonFromPokeApi } from '~/server/infrastructures/pokeapi';

// ポケモン一覧ドメインモデルのスキーマ
const pokemonsSchema = z.object({
	id: z.number(),
	name: z.string(),
	image: z.string(),
	types: z.string().array(),
});

// スキーマから型を取り出す
export type Pokemons = z.infer<typeof pokemonsSchema>;

// クエリのスキーマ
const querySchema = z
	.object({
		offset: z.coerce.number(),
		limit: z.coerce.number(),
	})
	.partial();

// スキーマから型を取り出す
export type PokemonsQuery = z.infer<typeof querySchema>;

// クエリのバリデーション
export const validatePokemonsQuery = (query: unknown): PokemonsQuery => {
	return querySchema.parse(query);
};

// PokeAPIから受け取ったデータをポケモン一覧ドメインモデルへ変換
export const convert = (pokemon: PokemonFromPokeApi): Pokemons => {
	return pokemonsSchema.parse({
		id: pokemon.id,
		name: pokemon.name,
		image: pokemon.sprites.front_default,
		types: pokemon.types.map((type) => type.type.name),
	});
};
