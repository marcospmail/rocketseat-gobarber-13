import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'

import SignIn from '../../pages/SignIn'

const mockSignIn = jest.fn()

jest.mock('../../contexts/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockSignIn
    })
  }
})

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn()
    })
  }
})

describe('SignIn page', () => {
  it('should be able to sign in', () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Senha')
    const loginBtn = getByText('Entrar')

    fireEvent.changeText(emailInput, 'user@email.com')
    fireEvent.changeText(passwordInput, '123456')

    fireEvent.press(loginBtn)

    waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'user@email.com',
        password: '123456'
      })
    })
  })
})
