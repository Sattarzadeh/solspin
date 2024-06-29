// app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { WebSocketProvider } from "./context/WebSocketContext";
import { WalletContextProvider } from "./context/WalletContextProvider";
import { AuthProvider } from "./context/AuthContext";
import store from "../store";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
        <WalletContextProvider>
        <AuthProvider>
          <WebSocketProvider url="wss://h55zjyx6tg.execute-api.eu-west-2.amazonaws.com/dev">
            <QueryClientProvider client={queryClient}>
              <Toaster
                richColors
                position="top-right"
                expand={false}
                duration={5000}
                toastOptions={{
                  className: "toast-style",
                  closeButton: true,
                  descriptionClassName: "text-white",
                }}
              />
              {children}
            </QueryClientProvider>
          </WebSocketProvider>
          </AuthProvider>
        </WalletContextProvider>

    </Provider>
  );
}
