// モデルからクエリの型とポケモン詳細ドメインモデルの型をインポート
import type { Pokemon } from '~/server/domains/models/pokemons/pokemon';
// ポケモン一覧ドメインモデルの型をインポート
import type {
	PokemonsQuery,
	Pokemons as PokemonListItem,
} from '~/server/domains/models/pokemons';
// インフラからPokeAPIの一覧と詳細の取得処理をインポート
import {
	getPokemons as getPokemonsFromPokeApi,
	getPokemon as getPokemonFromPokeApi,
} from '~/server/infrastructures/pokeapi/pokemons';
// ポケモン一覧ドメインモデルへの変換処理をインポート
import { convert as convertListItem } from '~/server/domains/models/pokemons';
// ポケモン詳細ドメインモデルへの変換処理をインポート
import { convert } from '~/server/domains/models/pokemons/pokemon';

// クエリを生成するメソッド　不必要なクエリを除外
const createQuery = ({ offset, limit }: PokemonsQuery) => {
	// Object.entries() は、オブジェクトのキーと値のペアを配列の形式で取得するもの 例：[['offset', 10], ['limit', undefined]]
	return Object.entries({
		offset,
		limit,
	})
		.filter(([_, value]) => value !== undefined) // value が undefined のものを除外
		.reduce((obj, [key, value]) => {
			return Object.assign(obj, { [key]: value }); // フィルタリングされた値を再度オブジェクトに変換
		}, {});
};

// ポケモン一覧取得処理を抽象化
// データの取得元が変更される可能性に柔軟に対応するため(PokeAPI → データベース に切り替える場合、インフラ層の処理を変更するだけで済む)
export const getPokemons = async (
	query: PokemonsQuery
): Promise<PokemonListItem[]> => {
	const pokemonsFromPokeApi = await getPokemonsFromPokeApi(createQuery(query));
	const pokemons = await Promise.all(
		pokemonsFromPokeApi.results.map(async (pokemon) => {
			//ポケモン名からポケモン詳細取得
			const response = await getPokemonFromPokeApi(pokemon.name);
			// ポケモン一覧どうメインモデルへ変換
			return convertListItem(response);
		})
	);
	return pokemons;
};

// ポケモン詳細取得処理を抽象化
export const getPokemon = async (name: string): Promise<Pokemon> => {
	const pokemon = await getPokemonFromPokeApi(name);

	return convert(pokemon);
};
