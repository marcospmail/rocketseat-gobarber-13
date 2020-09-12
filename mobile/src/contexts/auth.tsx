import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  createContext
} from 'react'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import api from '../services/api'

interface UserState {
  user: Record<string, unknown>
  token: string
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: UserState | null
  loading: boolean
  signIn(credentials: SignInCredentials): void
  signOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserState | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUserData = async () => {
      const [
        asyncStorageTokenArray,
        asyncStorageUserArray
      ] = await AsyncStorage.multiGet(['@GoBarber:token', '@GoBarber:user'])

      const asyncStorageToken = asyncStorageTokenArray[1]
      const asyncStorageUser = asyncStorageUserArray[1]

      if (!!asyncStorageToken && !!asyncStorageUser) {
        const userState = {
          token: asyncStorageToken,
          user: JSON.parse(asyncStorageUser)
        }
        setUser(userState)
      }

      setLoading(false)
    }
    fetchUserData()
  }, [])

  const signIn = useCallback(
    async ({ email, password }: SignInCredentials): Promise<void> => {
      try {
        const { data } = await api.post('/sessions', {
          email,
          password
        })

        console.log(data)

        const { user: responseUser, token: responseToken } = data

        await AsyncStorage.multiSet([
          ['@GoBarber:token', responseToken],
          ['@GoBarber:user', JSON.stringify(responseUser)]
        ])

        setUser({ token: responseToken, user: responseUser })
      } catch (err) {
        const { status, message } = err.response.data
        Alert.alert(status, message)
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:user', '@GoBarber:token'])
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be within an AuthProvider')
  }

  return context
}

export { useAuth, AuthProvider }
