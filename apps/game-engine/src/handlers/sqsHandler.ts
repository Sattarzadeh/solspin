import { SQSEvent, SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        console.log('Processing SQS message:', body);

        const userId = body.userId; 
        const caseId = body.caseId; 
        const clientSeed = body.clientSeed; 
        const serverSeed = body.serverSeed; 
        const timestamp = body.timestamp
        
    }
};
