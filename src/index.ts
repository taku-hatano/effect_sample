import { Effect, pipe } from "effect";
import { getData } from "./getData";
import { validateParams } from "./validate";

export function pipeline(params: unknown) {
	return pipe(
		validateParams(params),
		Effect.flatMap(getData),
		Effect.catchTags({
			ValidationError: (error) => {
				return Effect.succeed({
					error: true as const,
					message: error.message,
				});
			},
		}),
	);
}
