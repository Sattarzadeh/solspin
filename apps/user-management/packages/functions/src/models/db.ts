export interface dbTableSchema {
  TableName: string;
  Item: { [key: string]: any };
}

export interface UpdateParams {
  TableName: string;
  Key: { [key: string]: any };
  UpdateExpression: string;
  ExpressionAttributeNames?: { [key: string]: string };
  ExpressionAttributeValues: { [key: string]: any };
  ConditionExpression: string;
}
