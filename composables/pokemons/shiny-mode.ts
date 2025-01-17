/**
 * useShinyMode
 * 依存性注入（Dependency Injection）を利用して、`isShiny` の状態を共有するカスタムフック
 *
 * - `inject()` を使用して、親から `isShiny` を取得
 * - もし `provide()` されていなければ、新しく `isShiny` を作成し `provide()` する
 * - `isShiny` は `ref<boolean>` として管理される
 *
 * @param {string | InjectionKey<Ref<boolean>>} injectionKey - `provide/inject` で使用するキー（デフォルトは `Symbol()` でユニーク）
 * @returns {{ isShiny: Ref<boolean> }} - `isShiny` の状態を持つオブジェクト
 */
export const useShinyMode = (
	injectionKey: string | InjectionKey<Ref<boolean>> = Symbol() // injectionKey のデフォルトはユニークな Symbol()
) => {
	// `inject` を使用して `injectionKey` に紐づいた `isShiny` を取得する
	// 第2引数には「もし `provide` されていなかった場合のデフォルト値」として関数を渡す
	const isShiny = inject(
		injectionKey,
		() => {
			// `isShiny` のデフォルト値を `false` に設定
			const isShiny = ref(false);

			// `provide()` で `isShiny` を提供する（最初に `useShinyMode()` を呼び出したコンポーネントが Provider となる）
			provide(injectionKey, isShiny);

			// 初期化した `isShiny` を返す
			return isShiny;
		},
		true // `provide()` されていなくてもエラーを出さない
	);

	// `isShiny` を返して、コンポーネントで使用できるようにする
	return { isShiny };
};
