// app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { WebSocketProvider } from "./context/WebSocketContext";
import { WalletContextProvider } from "./context/WalletContextProvider";
import store from "../store";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WalletContextProvider>
        <WebSocketProvider url="wss://h55zjyx6tg.execute-api.eu-west-2.amazonaws.com/dev">
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
        </WebSocketProvider>
      </WalletContextProvider>
    </Provider>
  );
}
