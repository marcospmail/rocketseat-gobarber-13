import React, { useState, useContext, useCallback, createContext } from 'react'
import { v4 } from 'uuid'

import ToastContainer from '../components/ToastContainer'

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void
  removeToast(id: string): void
}

export interface ToastMessage {
  id: string
  type?: 'info' | 'error' | 'success'
  message: string
  description?: string
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData)

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const addToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    setMessages(oldMessages => [...oldMessages, { ...message, id: v4() }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setMessages(oldMessages => oldMessages.filter(message => message.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextData {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used withn a TostProvider')
  }

  return context
}

export { ToastProvider, useToast }
