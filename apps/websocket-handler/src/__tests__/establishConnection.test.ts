import {
  handleNewConnection,
  authenticateUser,
  handleLogout,
  handleConnectionClose,
  getConnectionInfo,
} from "../services/establishConnection";
import * as connectionRepository from "../repository/connectionRepository";
import { ConnectionInfo } from "../models/connectionInfo";

jest.mock("../repository/connectionRepository");

describe("webSocketService", () => {
  const connectionId = "test-connection-id";
  const userId = "user123";
  const serverSeed = "test-server-seed";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("handleNewConnection should save new connection info", async () => {
    const mockSaveConnectionInfo = jest
      .spyOn(connectionRepository, "saveConnectionInfo")
      .mockResolvedValue();

    await handleNewConnection(connectionId);

    expect(mockSaveConnectionInfo).toHaveBeenCalledWith(connectionId, {
      isAuthenticated: false,
    });
  });

  test("authenticateUser should update connection info with userId and isAuthenticated", async () => {
    const connectionInfo: ConnectionInfo = {
      isAuthenticated: false,
      serverSeed,
    };
    jest.spyOn(connectionRepository, "getConnectionInfoFromDB").mockResolvedValue(connectionInfo);
    const mockSaveConnectionInfo = jest
      .spyOn(connectionRepository, "saveConnectionInfo")
      .mockResolvedValue();

    await authenticateUser(connectionId, userId);

    expect(mockSaveConnectionInfo).toHaveBeenCalledWith(connectionId, {
      isAuthenticated: true,
      userId,
      serverSeed,
    });
  });

  test("handleLogout should update connection info to unauthenticated and remove userId", async () => {
    const connectionInfo: ConnectionInfo = {
      isAuthenticated: true,
      userId,
      serverSeed,
    };
    jest.spyOn(connectionRepository, "getConnectionInfoFromDB").mockResolvedValue(connectionInfo);
    const mockSaveConnectionInfo = jest
      .spyOn(connectionRepository, "saveConnectionInfo")
      .mockResolvedValue();

    await handleLogout(connectionId);

    expect(mockSaveConnectionInfo).toHaveBeenCalledWith(connectionId, {
      isAuthenticated: false,
      serverSeed,
    });
  });

  test("handleConnectionClose should delete connection info", async () => {
    const mockDeleteConnectionInfo = jest
      .spyOn(connectionRepository, "deleteConnectionInfo")
      .mockResolvedValue();

    await handleConnectionClose(connectionId);

    expect(mockDeleteConnectionInfo).toHaveBeenCalledWith(connectionId);
  });

  test("getConnectionInfo should return connection info from the repository", async () => {
    const connectionInfo: ConnectionInfo = {
      isAuthenticated: true,
      userId,
      serverSeed,
    };
    jest.spyOn(connectionRepository, "getConnectionInfoFromDB").mockResolvedValue(connectionInfo);

    const result = await getConnectionInfo(connectionId);

    expect(result).toEqual(connectionInfo);
  });

  test("getConnectionInfo should return null if no connection info is found", async () => {
    jest.spyOn(connectionRepository, "getConnectionInfoFromDB").mockResolvedValue(null);

    const result = await getConnectionInfo(connectionId);

    expect(result).toBeNull();
  });
});
