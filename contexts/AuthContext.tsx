'use client'

import { createContext, useContext, ReactNode } from 'react'

interface User {
  id: string
  username: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  onLogout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
  user: User | null
  onLogout: () => void
}

export const AuthProvider = ({ children, user, onLogout }: AuthProviderProps) => {
  return (
    <AuthContext.Provider value={{ user, onLogout }}>
      {children}
    </AuthContext.Provider>
  )
}
