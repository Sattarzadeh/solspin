import AWS from "aws-sdk";
import { dbTableSchema, UpdateParams } from "../models/db";

const dynamoDBClient = new AWS.DynamoDB.DocumentClient();

export class DynamoDbService {
  async createRecord(params: dbTableSchema): Promise<any> {
    try {
      await dynamoDBClient.put(params).promise();
      return params.Item;
    } catch (error) {
      throw new Error(`Error creating record: ${(error as Error).message}`);
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
      console.log(params);
      const result = await dynamoDBClient.update(params).promise();
      return result.Attributes;
    } catch (error) {
      throw new Error(`Error updating record: ${(error as Error).message}`);
    }
  }

  buildUpdateParams(
    tableName: string,
    key: { [key: string]: any },
    updateFields: { [key: string]: any }
  ): UpdateParams {
    let updateExpression = "set";
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    updateFields["updatedAt"] = new Date().toISOString();

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
      ConditionExpression: "attribute_exists(#attr0)",
    };
  }

  async deleteRecord(tableName: string, key: { [key: string]: any }): Promise<any> {
    const params = {
      TableName: tableName,
      Key: key,
      ConditionExpression: "attribute_exists(userId)", // Optional: Ensure the item exists before deleting
    };

    try {
      await dynamoDBClient.delete(params).promise();
      return { message: "Record deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting record: ${(error as Error).message}`);
    }
  }

  async createWallet(walletAddress: string, userId: string): Promise<void> {
    // Implement wallet creation logic if needed
    return;
  }
}
