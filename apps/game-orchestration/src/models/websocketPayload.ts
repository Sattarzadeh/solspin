export interface webSocketPayload {
    token: string;
    caseId: string;
    sessionId: string;
    spins: number;
    clientSeed: string;
    serverSeedHash: string;
}