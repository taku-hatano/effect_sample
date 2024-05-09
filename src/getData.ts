import { Context, Effect } from "effect";
import type { Params } from "./validate";

// データ取得のためのインターフェース
export type GetData = (params: Params) => {
	id: number;
	name: string;
	price: number;
};
// 実装とインターフェースを紐づけるためのコンテキスト
export const GetDataContext = Context.GenericTag<GetData>("GetData");

export function getData(params: Params) {
	return Effect.gen(function* (_) {
		const getData = yield* _(GetDataContext);
		const data = getData(params);
		return data;
	});
}
