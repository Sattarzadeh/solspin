export interface webSocketPayload {
    token: string;
    caseId: number;
    sessionId: string;
    spins: number;
    clientSeed: string;
    serverSeedHash: string;
}