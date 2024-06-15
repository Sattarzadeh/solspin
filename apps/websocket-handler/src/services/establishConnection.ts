import { ConnectionInfo } from "../models/connectionInfo";

async function saveConnectionInfo(connectionId: string, info: ConnectionInfo): Promise<void> {
  // Implement the function to save connection info to DynamoDB
}

async function deleteConnectionInfo(connectionId: string): Promise<void> {
  // Implement the function to delete connection info from DynamoDB
}

async function getConnectionInfoFromDB(connectionId: string): Promise<ConnectionInfo | null> {
  // Implement the function to get connection info from DynamoDB
  return null; // Placeholder return
}

export const handleNewConnection = async (connectionId: string): Promise<string> => {
  const connectionInfo: ConnectionInfo = {
    isAuthenticated: false,
  };

  await saveConnectionInfo(connectionId, connectionInfo);
  return connectionId;
};

export const authenticateUser = async (connectionId: string, userId: string): Promise<void> => {
  const connectionInfo = await getConnectionInfoFromDB(connectionId);
  if (connectionInfo) {
    connectionInfo.isAuthenticated = true;
    connectionInfo.userId = userId;
    await saveConnectionInfo(connectionId, connectionInfo);
  }
};

export const handleLogout = async (connectionId: string): Promise<void> => {
  const connectionInfo = await getConnectionInfoFromDB(connectionId);
  if (connectionInfo) {
    connectionInfo.isAuthenticated = false;
    delete connectionInfo.userId;
    await saveConnectionInfo(connectionId, connectionInfo);
  }
};

export const handleConnectionClose = async (connectionId: string): Promise<void> => {
  await deleteConnectionInfo(connectionId);
};

export const getConnectionInfo = async (connectionId: string): Promise<ConnectionInfo | null> => {
  return await getConnectionInfoFromDB(connectionId);
};
