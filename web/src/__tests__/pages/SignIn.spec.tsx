import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import SignIn from '../../pages/SignIn'

const mockPushFunction = jest.fn()
const mockSignInFunction = jest.fn()
const mockAddToast = jest.fn()

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockPushFunction,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  }
})

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockSignInFunction,
    }),
  }
})

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockAddToast,
    }),
  }
})

describe('SignIn page', () => {
  beforeEach(() => {
    mockPushFunction.mockClear()
    mockSignInFunction.mockClear()
    mockAddToast.mockClear()
  })

  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const loginButton = getByText('Entrar')

    const data = {
      email: 'user@email.com',
      password: 'any-password',
    }

    fireEvent.change(emailField, { target: { value: data.email } })
    fireEvent.change(passwordField, { target: { value: data.password } })

    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(mockSignInFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          email: data.email,
          password: data.password,
        })
      )
    })
  })

  it('should not be able to sign in with invalid user', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const loginButton = getByText('Entrar')

    const data = {
      email: 'invalid-user',
      password: 'any-password',
    }

    fireEvent.change(emailField, { target: { value: data.email } })
    fireEvent.change(passwordField, { target: { value: data.password } })

    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(mockSignInFunction).not.toHaveBeenCalled()
    })
  })

  it('should show toast when failed to login', async () => {
    mockSignInFunction.mockImplementation(() => {
      throw new Error()
    })

    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const loginButton = getByText('Entrar')

    const data = {
      email: 'invalid-user',
      password: 'any-password',
    }

    fireEvent.change(emailField, { target: { value: data.email } })
    fireEvent.change(passwordField, { target: { value: data.password } })

    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(mockAddToast).not.toHaveBeenCalled()
    })
  })
})
