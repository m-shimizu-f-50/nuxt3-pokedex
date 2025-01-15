// 表示用の名前をフォーマットする
export const formatName = (name: string) => {
	return name
		.toLowerCase() // すべて小文字に変換
		.split('-') // ハイフンで文字列を分割し、配列に変換する 例: "foo-bar" => ["foo", "bar"]
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // 配列の各要素の先頭文字を大文字に変換する 例: ["foo", "bar"] => ["Foo", "Bar"]
		.join(' '); // 配列を文字列に変換する 例: ["Foo", "Bar"] => "Foo Bar"
};
