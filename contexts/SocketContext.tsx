'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  sendMessage: (receiverId: string, content: string, messageType?: string) => void
  startTyping: (receiverId: string) => void
  stopTyping: (receiverId: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

interface SocketProviderProps {
  children: ReactNode
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const token = localStorage.getItem('token')
    if (!token) return

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token
      }
    })

    newSocket.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      setIsConnected(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [user])

  const sendMessage = (receiverId: string, content: string, messageType: string = 'text') => {
    if (socket && isConnected) {
      socket.emit('send_message', {
        receiverId,
        content,
        messageType
      })
    }
  }

  const startTyping = (receiverId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { receiverId })
    }
  }

  const stopTyping = (receiverId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { receiverId })
    }
  }

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      sendMessage,
      startTyping,
      stopTyping
    }}>
      {children}
    </SocketContext.Provider>
  )
}
