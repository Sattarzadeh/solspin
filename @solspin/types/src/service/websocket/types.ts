export interface ConnectionInfo {
  isAuthenticated: boolean;
  userId?: string;
  serverSeed?: string;
}

export interface WebSocketPayload {
  connectionId: string;
  userId: string;
  serverSeed: string;
}
