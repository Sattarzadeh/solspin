import { CaseSchema } from "../game-engine/types";
import { z } from "zod";
const SpinPayloadSchema = z.object({
  caseModel: CaseSchema,
  serverSeed: z.string(),
  clientSeed: z.string(),
});

// Request Schemas
export const CreateSpinPayloadRequestSchema = SpinPayloadSchema;
export const GetSpinPayloadByServerSeedRequestSchema = SpinPayloadSchema.pick({ serverSeed: true });
export const GetSpinPayloadByClientSeedRequestSchema = SpinPayloadSchema.pick({ clientSeed: true });

// Query Schemas
export const SpinPayloadQuerySchema = z.object({
  caseModel: z.string().optional(),
  serverSeed: z.string().optional(),
  clientSeed: z.string().optional(),
});

// Response Schemas
export const CreateSpinPayloadResponseSchema = SpinPayloadSchema;
export const GetSpinPayloadByServerSeedResponseSchema = SpinPayloadSchema;
export const GetSpinPayloadByClientSeedResponseSchema = SpinPayloadSchema;

// Export the schemas and types
export { SpinPayloadSchema };

export type SpinPayload = z.infer<typeof SpinPayloadSchema>;
