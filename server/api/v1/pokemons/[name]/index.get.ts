// モデルからパラメータのバリデーションの処理をインポート
import { validatePokemonParams } from '~/server/domains/models/pokemons/pokemon';
// レポジトリからポケモン詳細取得処理をインポート
import { getPokemon } from '~/server/domains/repositories/pokemons';

// APIリクエストの結果をサーバーサイドのメモリにキャッシュする
export default defineCachedEventHandler(
	async (event) => {
		try {
			// パラメータのバリデーションを行い、型安全なデータとして取得
			const { name } = await getValidatedRouterParams(
				event,
				validatePokemonParams
			);
			// パラメータのポケモン名を元にポケモン詳細データを取得
			const pokemon = await getPokemon(name);

			return pokemon;
		} catch (error) {
			console.error('APIリクエスト中にエラーが発生しました。', error);
		}
	},
	{
		maxAge: 24 * 60 * 60, // キャッシュのmaxAgeを設定 (1日)
	}
);
