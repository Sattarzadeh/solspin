import { randomUUID } from 'crypto';
import { User } from '../models/users';
import { DynamoDbService } from './dynamoDbService';

export class UserDbService {

    private dynamoDbService: DynamoDbService;

    constructor() {
        this.dynamoDbService = new DynamoDbService();
    }

    async updateUserData(key: { [key: string]: any }, updateFields: { [key: string]: any }): Promise<any> {
        const params = this.dynamoDbService.buildUpdateParams('Users', key, updateFields);
        return this.dynamoDbService.updateRecord(params);
    }

    async createUser(walletAddress: string): Promise<any> {
        const userId = randomUUID(); 
    

        await this.dynamoDbService.createWallet(walletAddress, userId);
    
        const newUser: User = {
            userId: userId,
            username: walletAddress,
            discordName: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    
        const userParams = this.dynamoDbService.buildCreateParams('Users', newUser);
        return this.dynamoDbService.createRecord(userParams);
      }
    

}

function uuidv4() {
    throw new Error('Function not implemented.');
}
