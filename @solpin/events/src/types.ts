import * as z from "zod";
import { Service } from "@solpin/types";

export interface EventBody<T> {
  publisher: Service;
  metadata: {
    requestId?: string;
  };
  payload: T;
}

export interface EventProvider {
  name: string;
  schema: z.ZodSchema;
}
