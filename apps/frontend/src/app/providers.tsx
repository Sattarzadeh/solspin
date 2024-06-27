// app/providers.tsx
'use client'

import { Provider } from 'react-redux'
import { WebSocketProvider } from './context/WebSocketContext'
import { WalletContextProvider } from './context/WalletContextProvider'
import store from '../store'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WalletContextProvider>
        <WebSocketProvider url="wss://hk6jcvvb6h.execute-api.eu-west-2.amazonaws.com/dev">
          {children}
        </WebSocketProvider>
      </WalletContextProvider>
    </Provider>
  )
}