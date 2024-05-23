import dynamoDBClient from '../db/dynamoDBClient';
import { dbTableSchema, UpdateParams } from '../models/db'
import axios from 'axios';

export class DynamoDbService {
    async createRecord(params: dbTableSchema): Promise<any> {
        try {
          await dynamoDBClient.put(params).promise();
          return params.Item;
        } catch (error) {
          throw new Error(`Error creating record: ${error.message}`);
        }
      }
    

      buildCreateParams(tableName: string, newItem: { [key: string]: any }): dbTableSchema {
        return {
          TableName: tableName,
          Item: newItem,
        };
      }
    

      async updateRecord(params: UpdateParams): Promise<any> {
        try {
          const result = await dynamoDBClient.update(params).promise();
          return result.Attributes;
        } catch (error) {
          throw new Error(`Error updating record: ${error.message}`);
        }
      }
    

      buildUpdateParams(
        tableName: string,
        key: { [key: string]: any },
        updateFields: { [key: string]: any }
      ): UpdateParams {
        let updateExpression = 'set';
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};
    
        Object.keys(updateFields).forEach((field, index) => {
          const attributeName = `#attr${index}`;
          const attributeValue = `:val${index}`;
          updateExpression += ` ${attributeName} = ${attributeValue},`;
          expressionAttributeNames[attributeName] = field;
          expressionAttributeValues[attributeValue] = updateFields[field];
        });
    

        updateExpression = updateExpression.slice(0, -1);
    
        return {
          TableName: tableName,
          Key: key,
          UpdateExpression: updateExpression,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
        };
      }


      async createWallet(walletAddress: string, userId: string): Promise<void> {
        try {
          const response = await axios.post('http://your-wallet-service-endpoint/create', {
            walletAddress: walletAddress,
            userId: userId
          });
          if (response.status !== 201) {
            throw new Error('Failed to create wallet');
          }
        } catch (error) {
          throw new Error(`Error creating wallet: ${error.message}`);
        }
      }
}
