import { Data, Effect } from "effect";
import { z } from "zod";

const schema = z.object({
	keyword: z.string(),
	caterogy: z.enum(["category1", "category2", "category3"]),
	sort: z.enum(["low", "high"]),
});
export type Params = z.infer<typeof schema>;

// Effectでエラーハンドリングを行いやすいように、Data.TaggedErrorを使ってエラーを定義
export class ValidationError extends Data.TaggedError("ValidationError")<{
	message: string;
}> {
	public static fromZodError(error: z.ZodError) {
		return new ValidationError({
			message: error.errors.map((e) => e.message).join(", "),
		});
	}
}

export function validateParams(params: unknown) {
	const result = schema.safeParse(params);
	if (!result.success) {
		// エラー発生時にはEffect.failを使ってエラーを返す
		return Effect.fail(ValidationError.fromZodError(result.error));
	}
	return Effect.succeed(result.data);
}

export function validateParamsGen(params: unknown) {
	return Effect.gen(function* () {
		const result = schema.safeParse(params);
		if (!result.success) {
			return yield* Effect.fail(ValidationError.fromZodError(result.error));
		}
		return result.data;
	});
}
