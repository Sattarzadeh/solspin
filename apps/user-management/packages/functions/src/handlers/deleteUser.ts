import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDbService } from "../services/dynamoDbService";

const dynamoDbService = new DynamoDbService();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { userId } = JSON.parse(event.body || "{}");

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing user_id" }),
      };
    }

    const result = await dynamoDbService.deleteRecord("users", { userId });

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
