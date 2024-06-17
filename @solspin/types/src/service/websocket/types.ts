export interface ConnectionInfo {
  isAuthenticated: boolean;
  userId?: string;
  serverSeed?: string;
  connectionId: string;
}

export interface WebSocketOrchestrationPayload {
  caseId: string;
  clientSeed: string;
}
