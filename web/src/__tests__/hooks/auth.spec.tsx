import { renderHook, act } from '@testing-library/react-hooks'
import { AuthProvider, useAuth } from '../../hooks/auth'
import MockAdapter from 'axios-mock-adapter'

import api from '../../services/api'

const apiMock = new MockAdapter(api)

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: '123',
        name: 'John Doe',
        email: 'user@email.com',
      },
      token: 'token-123',
    }

    const localStorageSetItemFunction = jest.spyOn(Storage.prototype, 'setItem')

    apiMock.onPost('sessions').reply(200, apiResponse)

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    result.current.signIn({
      email: 'user@email.com',
      password: 'anything',
    })

    await waitForNextUpdate()

    expect(result.current.user.email).toEqual('user@email.com')

    expect(localStorageSetItemFunction).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token
    )

    expect(localStorageSetItemFunction).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user)
    )
  })

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123'
        case '@GoBarber:user':
          return JSON.stringify({
            id: '123',
            name: 'John Doe',
            email: 'user@email.com',
          })
        default:
          return null
      }
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user.email).toEqual('user@email.com')
  })

  it('should remove local storage data when signOut', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123'
        case '@GoBarber:user':
          return JSON.stringify({
            id: '123',
            name: 'John Doe',
            email: 'user@email.com',
          })
        default:
          return null
      }
    })

    const setItem = jest.spyOn(Storage.prototype, 'removeItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.signOut()
    })

    expect(setItem).toHaveBeenCalledTimes(2)
    expect(result.current.user).toBeUndefined()
  })

  it('should be able to update user', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem')

    const user = {
      id: '123',
      name: 'John Doe',
      email: 'user@email.com',
      avatar_url: 'whatever.png',
    }

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.updateUser(user)
    })

    expect(setItem).toHaveBeenCalledWith('@GoBarber:user', JSON.stringify(user))
    expect(result.current.user).toEqual(user)
  })
})
