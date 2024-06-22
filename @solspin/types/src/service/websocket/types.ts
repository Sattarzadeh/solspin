export interface ConnectionInfo {
  isAuthenticated: boolean;
  userId?: string;
  serverSeed?: string;
  connectionId: string;
  caseId?: string;
}

export interface WebSocketOrchestrationPayload {
  caseId: string;
  clientSeed: string;
}
