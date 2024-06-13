
import { ZodSchema } from "zod";


export function validateEvent<T>(payload: unknown, schema: ZodSchema<T>): T {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new Error(`Event validation failed: ${JSON.stringify(result.error.issues)}`);
  }

  return result.data;
}

