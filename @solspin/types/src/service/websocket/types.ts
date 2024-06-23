import { z } from "zod";

const ConnectionInfoSchema = z.object({
  isAuthenticated: z.boolean(),
  userId: z.string().uuid().optional(),
  serverSeed: z.string().optional(),
  connectionId: z.string(),
});

const WebSocketOrchestrationPayloadSchema = z.object({
  caseId: z.string().uuid(),
  clientSeed: z.string().regex(/^[a-zA-Z0-9]+$/),
});

export { ConnectionInfoSchema, WebSocketOrchestrationPayloadSchema };

export type ConnectionInfo = z.infer<typeof ConnectionInfoSchema>;
export type WebSocketOrchestrationPayload = z.infer<typeof WebSocketOrchestrationPayloadSchema>;
