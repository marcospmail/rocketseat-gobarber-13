import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
  createContext
} from 'react'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import api from '../services/api'

interface User {
  id: string
  name: string
  email: string
  avatar_url: string
}

interface UserState {
  user: User
  token: string
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: User | null
  loading: boolean
  signIn(credentials: SignInCredentials): void
  signOut(): void
  updateUser(user: User): Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<UserState | null>(null)
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
        setData(userState)

        api.defaults.headers.authorization = `Bearer ${asyncStorageToken}`
      }

      setLoading(false)
    }
    fetchUserData()
  }, [])

  const signIn = useCallback(
    async ({ email, password }: SignInCredentials): Promise<void> => {
      try {
        const response = await api.post('/sessions', {
          email,
          password
        })

        const { user: responseUser, token: responseToken } = response.data

        await AsyncStorage.multiSet([
          ['@GoBarber:token', responseToken],
          ['@GoBarber:user', JSON.stringify(responseUser)]
        ])

        api.defaults.headers.authorization = `Bearer ${responseToken}`

        setData({ token: responseToken, user: responseUser })
      } catch (err) {
        const { status, message } = err.response.data
        Alert.alert(status, message)
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:userAuth', '@GoBarber:token'])
    setData(null)
  }, [])

  const updateUser = useCallback(async (user: User) => {
    setData(oldData => {
      return {
        token: oldData!.token,
        user
      }
    })

    await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user))
  }, [])

  const userAhhh = useMemo(() => {
    if (!data) return null

    return data.user
  }, [data])

  return (
    <AuthContext.Provider
      value={{ user: userAhhh, signIn, signOut, updateUser, loading }}
    >
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
