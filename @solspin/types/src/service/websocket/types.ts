export interface ConnectionInfo {
  isAuthenticated: boolean;
  userId?: string;
  serverSeed?: string;
  connectionId: string;
}

export interface WebSocketOrchestrationPayload {
  connectionId: string;
  caseId: string;
  clientSeed: string;
}
