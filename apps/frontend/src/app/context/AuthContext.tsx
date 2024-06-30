// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWebSocket } from "./WebSocketContext";

interface User {
  userId: string;
  username: string;
  updatedAt: string;
  createdAt: string;
  level: number;
  discord: string;
  walletAddress: string;
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
    console.log('Login function called');
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

      } else {
        console.error('Login failed');
        setUser(null);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setUser(null);
    }
  };

  const logout = async () => {
    console.log('Logout function called');
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/auth/disconnect`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        await disconnect();
        setUser(null);
        sendMessage(
          JSON.stringify({
            action: "unauthenticate",
            token: token,
          })
        );
        localStorage.removeItem("token");
        
        console.log('Logged out successfully');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
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
