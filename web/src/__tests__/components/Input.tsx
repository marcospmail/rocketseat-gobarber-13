import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { FiMail } from 'react-icons/fi'

import Input from '../../components/Input'

jest.mock('@unform/core', () => {
  return {
    useField: () => ({
      fieldName: 'email',
      defaultName: 'email',
      error: '',
      registerField: jest.fn(),
    }),
  }
})

describe('Input Field', () => {
  beforeEach(() => {
    jest.mock('@unform/core', () => {
      return {
        useField: () => ({
          fieldName: 'input',
          defaultValue: '',
          error: 'This is a error, Im sure!',
          registerField: jest.fn(),
        }),
      }
    })
  })

  it('should show a Input field in page', () => {
    const placeholderText = 'input'

    const { getByPlaceholderText } = render(
      <Input name="input" placeholder={placeholderText} />
    )

    expect(getByPlaceholderText(placeholderText)).toBeTruthy()
  })

  it('should highlight border when focused', async () => {
    const placeholderText = 'input'

    const { getByPlaceholderText, getByTestId } = render(
      <Input name="input" placeholder={placeholderText} />
    )

    const inputContainerElement = getByTestId('input-container')
    const inputField = getByPlaceholderText(placeholderText)

    fireEvent.focus(inputField)

    await waitFor(() => {
      expect(inputContainerElement).toHaveStyle('border: 2px solid #ff9000;')
    })
  })

  it('should change icon color when filled', async () => {
    const placeholderText = 'input'

    const { getByPlaceholderText, getByTestId } = render(
      <Input name="input" placeholder={placeholderText} icon={FiMail} />
    )

    const inputField = getByPlaceholderText(placeholderText)
    const inputIcon = getByTestId('input-icon')

    fireEvent.change(inputField, { target: { value: 'anything' } })

    await waitFor(() => {
      expect(inputIcon).toHaveStyle('color: #ff9000;')
    })
  })
})
