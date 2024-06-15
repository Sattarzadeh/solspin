// sst/src/handlers/generateSeedHandler.ts
import { ApiHandler } from "sst/node/api";
import { generateServerSeed } from "../../../../../../websocket-handler/src/services/handleConnections"; // Adjust the path as necessary

export const handler = ApiHandler(async (event) => {
  const connectionId = event.queryStringParameters?.connectionId;

  if (!connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId is required" }),
    };
  }

  try {
    const serverSeed = await generateServerSeed(connectionId);
    return {
      statusCode: 200,
      body: JSON.stringify({ serverSeed }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to generate server seed", error: error.message }),
    };
  }
});
