// モデルからクエリの型をインポート
import type { PokemonsQuery } from '~/server/domains/models/pokemons';
// インフラからPokeAPIの一覧の型をインポート
import type { Pokemons as PokemonsFromPokeApi } from '~/server/infrastructures/pokeapi/pokemons';
// インフラからPokeAPIの一覧の取得処理をインポート
import { getPokemons as getPokemonsFromPokeApi } from '~/server/infrastructures/pokeapi/pokemons';

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
): Promise<PokemonsFromPokeApi> => {
	const pokemons = await getPokemonsFromPokeApi(createQuery(query));

	return pokemons;
};
