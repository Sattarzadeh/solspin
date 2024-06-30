// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWebSocket } from "./WebSocketContext";
import { toast } from 'sonner';
interface User {
  userId: string;
  username: string;
  updatedAt: string;
  createdAt: string;
  level: number;
  discord: string;
  walletAddress: string;
  muteAllSounds: boolean;
  profileImageUrl: string;
}

interface AuthContextType {
  getUser: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const apiUrl: string = `${process.env.NEXT_PUBLIC_USER_MANAGEMENT_API_URL}`;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [getUser, setUser] = useState<User | null>(null);
  const { connected, disconnect, publicKey } = useWallet();
  const { sendMessage, connectionStatus } = useWebSocket();

  useEffect(() => {
    if (connected && publicKey) {
      login();
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [connected, publicKey]);

  const login = async () => {

    if (!publicKey) return;

    try {
      const response = await fetch(`${apiUrl}/auth/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      });

      if (response.ok) {
        const responsePayload = await response.json();
        const data = responsePayload.data;
        const user: User = data.user;
        const token: string = data.token;
        setUser(user);
        localStorage.setItem("token", token);
        if (connectionStatus === "connected") {
          sendMessage(
            JSON.stringify({
              action: "authenticate",
              token: token,
            })
          );
        }
        toast.success("Successfully logged in!")

      } else {
        toast.error("Failed to establish websocket connection!")
        setUser(null);
      }
    } catch (error) {
      toast.error("Failed to log in!")
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      await disconnect();
      setUser(null);
      toast.success('Logged out successfully!');
      sendMessage(
        JSON.stringify({
          action: "unauthenticate",
          token: token,
        })
      );
      localStorage.removeItem("token");
      
      

    } catch (error) {
      toast.error('Error occured during logout!');
    }
  };

  const contextValue: AuthContextType = {
    getUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
