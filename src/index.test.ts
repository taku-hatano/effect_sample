import { Context, Effect } from "effect";
import { pipeline } from ".";
import { GetDataContext } from "./getData";

function mockedPipeline(params: unknown) {
	return pipeline(params).pipe(
		Effect.provide(
			Context.make(GetDataContext, () => {
				return {
					id: 1,
					name: "test",
					price: 100,
				};
			}),
		),
	);
}
it("正常時", async () => {
	const result = await Effect.runPromise(
		mockedPipeline({ keyword: "test", caterogy: "category1", sort: "low" }),
	);
	expect(result).toEqual({ id: 1, name: "test", price: 100 });
});

it("リクエストエラー", async () => {
	const result = await Effect.runPromise(
		mockedPipeline({ keyword: "test", caterogy: "category1", sort: "invalid" }),
	);
	expect(result).toEqual({
		error: true,
		message: "Invalid enum value. Expected 'low' | 'high', received 'invalid'",
	});
});
