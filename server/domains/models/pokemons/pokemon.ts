import z from 'zod';
// インフラからPokeAPIの詳細の型をインポート
import type { Pokemon as PokemonFromPokeApi } from '~/server/infrastructures/pokeapi';

// ポケモン詳細ドメインモデルのスキーマ
const pokemonSchema = z.object({
	id: z.number(),
	name: z.string(),
	height: z.string(),
	weight: z.string(),
	abilities: z.string().array(),
	image: z.object({
		default: z.string(),
		shiny: z.string(),
	}),
	stats: z
		.object({
			name: z.string(),
			value: z.number(),
		})
		.array(),
	types: z.string().array(),
});

// スキーマから型を取り出す
export type Pokemon = z.infer<typeof pokemonSchema>;

// routerParamsのスキーマ
const routerParamsSchema = z.object({
	name: z.string(),
});

// スキーマから型を取り出す
export type PokemonParams = z.infer<typeof routerParamsSchema>;

// routerParamsのバリデーション
// 任意のデータ（unknown型）を引数に取り、parseメソッドでバリデーションを実行。
export const validatePokemonParams = (routerParams: unknown): PokemonParams => {
	return routerParamsSchema.parse(routerParams);
};

// PokeAPIから受け取ったデータをポケモン詳細ドメインモデルへ変換
export const convert = (pokemon: PokemonFromPokeApi): Pokemon => {
	return pokemonSchema.parse({
		id: pokemon.id,
		name: pokemon.name,
		height: convertHeight(pokemon.height),
		weight: convertWeight(pokemon.weight),
		abilities: pokemon.abilities.map((ability) => ability.ability.name),
		image: {
			default: pokemon.sprites.front_default,
			shiny: pokemon.sprites.front_shiny,
		},
		stats: calculateStats(pokemon.stats),
		types: pokemon.types.map((type) => type.type.name),
	});
};

// 高さをドメインモデル(メートル)に変換
const convertHeight = (height: number): string => {
	return (height / 10).toString() + 'm';
};

// 重さをドメインモデル(キログラム)に変換
const convertWeight = (weight: number): string => {
	return (weight / 10).toString() + 'kg';
};

// ステータスに合計値を計算し含める
const calculateStats = (
	pokemonStats: PokemonFromPokeApi['stats']
): { name: string; value: number }[] => {
	// ステータス名マッピング用
	const statNameMapping: Record<string, string> = {
		hp: 'HP',
		attack: 'こうげき',
		defense: 'ぼうぎょ',
		'special-attack': 'とくこう',
		'special-defense': 'とくぼう',
		speed: 'すばやさ',
	};

	// ステータスをドメインモデルへ変換
	const stats = pokemonStats.map((stat) => ({
		name: statNameMapping[stat.stat.name] || stat.stat.name,
		value: stat.base_stat,
	}));
	// 合計値を計算
	const totalStats = stats.reduce((sum, stat) => sum + stat.value, 0);
	// 合計値をステータスに追加
	stats.push({ name: '合計', value: totalStats });

	return stats;
};
