import { randomBytes } from "crypto";
import { server } from "typescript";
import { ConnectionInfo } from "../models/connectionInfo";
import {
  saveConnectionInfo,
  deleteConnectionInfo,
  getConnectionInfoFromDB,
} from "../repository/connectionRepository";

export const handleNewConnection = async (connectionId: string): Promise<string> => {
  const connectionInfo: ConnectionInfo = {
    isAuthenticated: false,
    connectionId,
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

export const generateServerSeed = async (connectionId: string): Promise<string> => {
  const connectionInfo = await getConnectionInfoFromDB(connectionId);

  if (connectionInfo && connectionInfo.isAuthenticated) {
    const serverSeed = randomBytes(32).toString("hex");
    connectionInfo.serverSeed = serverSeed;
    await saveConnectionInfo(connectionId, connectionInfo);
    return serverSeed;
  } else {
    throw new Error("Unauthorized: User is not authenticated");
  }
};

export const handleLogout = async (connectionId: string): Promise<void> => {
  const connectionInfo = await getConnectionInfoFromDB(connectionId);
  if (connectionInfo) {
    connectionInfo.isAuthenticated = false;
    delete connectionInfo.userId;
    delete connectionInfo.serverSeed;
    await saveConnectionInfo(connectionId, connectionInfo);
  }
};

export const handleConnectionClose = async (connectionId: string): Promise<void> => {
  await deleteConnectionInfo(connectionId);
};

export const getConnectionInfo = async (connectionId: string): Promise<ConnectionInfo | null> => {
  return await getConnectionInfoFromDB(connectionId);
};
