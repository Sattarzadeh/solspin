// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface User {
  userId: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const apiUrl: string = ""

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const { connected, disconnect, publicKey } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      login();
    } else {
      setUser(null);
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
        const data = responsePayload.data
        const user: User = data.user
        const token: string = data.token
        setUser(user);
        localStorage.setItem("token", token)
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
    try {
      const token = localStorage.getItem("token")
      
      const response = await fetch(`${apiUrl}/auth/logout`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        await disconnect();
        setUser(null);
        localStorage.removeItem("token")
        console.log('Logged out successfully');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const contextValue: AuthContextType = {
    user,
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