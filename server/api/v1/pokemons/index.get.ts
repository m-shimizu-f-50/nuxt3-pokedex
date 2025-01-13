// モデルからクエリのバリデーション処理をインポート
import { validatePokemonsQuery } from '~/server/domains/models/pokemons';
// レポジトリからポケモン一覧取得処理をインポート
import { getPokemons } from '~/server/domains/repositories/pokemons';

// API リクエストの結果をサーバーサイドのメモリにキャッシュする
// defineCachedEventHandler は Nuxt 3 の Nitro エンジン が提供するキャッシュ機能付きのイベントハンドラー。
// API リクエストの結果を サーバーサイドのメモリ にキャッシュし、設定した有効期限内であれば、外部 API へのリクエストを行わずにキャッシュからデータを返却する。
export default defineCachedEventHandler(
	async (event) => {
		try {
			// クエリのバリデーションを行い、型安全なクエリとして取得
			const query = await getValidatedQuery(event, validatePokemonsQuery);
			// クエリを元にポケモン一覧を取得
			const pokemons = await getPokemons(query);

			return pokemons;
		} catch (error) {
			console.error('APIリクエスト中にエラーが発生しました', error);
		}
	},
	{
		// maxAgeオプション: キャッシュの有効期限を設定 (1日)
		// 24 * 60 * 60 = 86400秒 = 1日
		maxAge: 24 * 60 * 60,
	}
);
