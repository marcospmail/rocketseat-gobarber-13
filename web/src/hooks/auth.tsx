import React, { useState, useCallback, createContext, useContext } from 'react'

import api from '../services/api'
import { useToast } from './toast'

interface User {
  id: string
  name: string
  avatar_url: string
}

interface AuthState {
  user: User
  token: string
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: User
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
}

const AuthContext = createContext({} as AuthContextData)

const AuthProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()

  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token')
    const user = localStorage.getItem('@GoBarber:user')

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`

      return { token, user: JSON.parse(user) }
    }

    return {} as AuthState
  })

  const signIn = useCallback(
    async ({ email, password }) => {
      try {
        const { data } = await api.post('sessions', {
          email,
          password,
        })

        const { token, user } = data

        localStorage.setItem('@GoBarber:token', token)
        localStorage.setItem('@GoBarber:user', JSON.stringify(user))

        api.defaults.headers.authorization = `Bearer ${token}`

        setData({ token, user })
      } catch (err) {
        let errorMessage = 'Ocorreu um erro ao realizar o login'

        if (err.response.status === 400) {
          errorMessage = err.response.data.message
        }

        addToast({
          type: 'error',
          message: 'Erro na autenticação',
          description: errorMessage,
        })
      }
    },
    [addToast]
  )

  const signOut = () => {
    localStorage.removeItem('@GoBarber:token')
    localStorage.removeItem('@GoBarber:user')

    setData({} as AuthState)
  }

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
