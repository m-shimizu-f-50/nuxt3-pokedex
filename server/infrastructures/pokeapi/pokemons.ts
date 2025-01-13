import z from 'zod';

/**
 * PokeAPI 一覧取得
 */
// PokeAPIから返却されるデータのスキーマ(ポケモンデータの型定義)
const rawPokemonsSchema = z.object({
	results: z
		.object({
			name: z.string(),
		})
		.array(),
});

// スキーマから型を取り出す
export type Pokemons = z.infer<typeof rawPokemonsSchema>;

// クエリのスキーマ(APIリクエストのクエリパラメータのバリデーション)
const querySchema = z
	.object({
		offset: z.number(),
		limit: z.number(),
	})
	.partial();
// スキーマから型を取り出す
type PokemonsQuery = z.infer<typeof querySchema>;

// PokeAPI からポケモンの Resource Lists データを取得する
export const getPokemons = async (
	query: PokemonsQuery = {}
): Promise<Pokemons> => {
	// runtimeConfig から PokeAPI の baseURL を取得する
	const {
		pokeapi: { baseURL },
	} = useRuntimeConfig();

	// APIリクエスト
	const response = await $fetch('pokemon', {
		baseURL,
		query,
	});

	// レスポンスデータのバリデーションを行い、型安全なデータとして返却する
	return rawPokemonsSchema.parse(response);
};

/**
 * PokeAPI 詳細取得
 */
// ポケモン詳細のスキーマ
const rawPokemonSchema = z.object({
	id: z.number(),
	name: z.string(),
	height: z.number(),
	weight: z.number(),
	abilities: z
		.object({
			ability: z.object({
				name: z.string(),
			}),
		})
		.array(),
	sprites: z.object({
		front_default: z.string(),
	}),
	stats: z
		.object({
			stat: z.object({
				name: z.string(),
			}),
			base_stat: z.number(),
		})
		.array(),
	types: z
		.object({
			type: z.object({
				name: z.string(),
			}),
		})
		.array(),
});

// スキーマから型を取り出す
export type Pokemon = z.infer<typeof rawPokemonSchema>;

// PokeAPI からポケモンの詳細データを取得する
export const getPokemon = async (name: string): Promise<Pokemon> => {
	// runtimeConfig から PokeAPI の baseURL を取得する
	const {
		pokeapi: { baseURL },
	} = useRuntimeConfig();

	// PokeAPI からポケモンの詳細データを取得する
	const response = await $fetch(`pokemon/${name}`, {
		baseURL,
	});

	// レスポンスデータのバリデーションを行い、型安全なデータとして返却する
	return rawPokemonSchema.parse(response);
};
