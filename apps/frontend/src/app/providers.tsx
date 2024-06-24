// app/providers.tsx
'use client'

import { Provider } from 'react-redux'
import { WebSocketProvider } from './context/WebSocketContext'
import store from '../store'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WebSocketProvider url="wss://ffz5rraabb.execute-api.eu-west-2.amazonaws.com/mehransattarzadeh">
        {children}
      </WebSocketProvider>
    </Provider>
  )
}