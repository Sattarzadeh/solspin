import { ApiHandler } from "sst/node/api";
import { getConnectionInfo } from "../../../../../../websocket-handler/src/services/handleConnections";
import { ConnectionInfo } from "../../../../../../websocket-handler/src/models/connectionInfo";
export const handler = ApiHandler(async (event) => {
  const connectionId = event.queryStringParameters?.connectionId;
  if (!connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId is required" }),
    };
  }

  try {
    const connectionInfo: ConnectionInfo | null = await getConnectionInfo(connectionId);
    return {
      statusCode: 200,
      body: JSON.stringify({ connectionInfo }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to get connection info", error: error.message }),
    };
  }
});
