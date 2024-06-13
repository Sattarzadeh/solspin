import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { randomUUID } from 'crypto';
import { User } from '../models/users';
import { DynamoDbService } from './dynamoDbService';

export class UserDbService {
    // Interface for the dynamodbservice
    private dynamoDbService: DynamoDbService;

    constructor() {
        this.dynamoDbService = new DynamoDbService();
    }

    async updateUserData(user_id, updateFields: { [key: string]: any }): Promise<any> {
        const key = {user_id}
        const params = this.dynamoDbService.buildUpdateParams('users', key, updateFields);
        return this.dynamoDbService.updateRecord(params);
    }

    async createUser(walletAddress: string): Promise<any> {
        const userId = randomUUID(); 
    

        await this.dynamoDbService.createWallet(walletAddress, userId);
    
        const newUser: User = {
            user_id: userId,
            username: walletAddress,
            discordName: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    
        const userParams = this.dynamoDbService.buildCreateParams('users', newUser);
        return this.dynamoDbService.createRecord(userParams);
      }
    

}
