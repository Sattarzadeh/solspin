import crypto from 'crypto';

export class CaseOpeningService {
    private clientSeed: string;
    private serverSeed: string;
    private combinedSeed: string;

    constructor() {
        this.clientSeed = "";
        this.serverSeed = "";
        this.combinedSeed = "";
    }

    private generateClientSeed(): void {
        this.clientSeed = Math.floor(Math.random() * 1000000000).toString();
    }

    private generateServerSeed(): void {
        this.serverSeed = crypto.randomBytes(16).toString('hex');
    }

    private generateCombinedSeed(): void {
        const timestamp = new Date().toISOString();
        const combinedString = `${this.clientSeed}-${this.serverSeed}-${timestamp}`;
        this.combinedSeed = crypto.createHash('sha256').update(combinedString).digest('hex');
    }

    public generateRollValue(): number {
        this.generateClientSeed();
        this.generateServerSeed();
        this.generateCombinedSeed();

        const randomSeed = parseInt(this.combinedSeed, 16);
        const rng = crypto.createHash('sha256').update(randomSeed.toString()).digest();
        return parseInt(rng.toString('hex'), 16) % 99999 + 1;
    }
}

