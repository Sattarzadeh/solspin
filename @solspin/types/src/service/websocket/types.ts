export interface ConnectionInfo {
  isAuthenticated: boolean;
  userId?: string;
  serverSeed?: string;
}

export interface WebSocketOrchestrationPayload {
  connectionId: string;
  caseId: string;
  clientSeed: string;
}
