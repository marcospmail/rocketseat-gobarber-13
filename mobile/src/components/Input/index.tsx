import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { TextInputProps } from 'react-native'
import { useField } from '@unform/core'

import { Container, TextInput, Icon } from './styles'

interface InputProps extends TextInputProps {
  name: string
  icon: string
}

interface InputValueReference {
  value: string
}

interface InputRef {
  focus(): void
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, ...rest },
  parentRef
) => {
  const inputElementRef = useRef<any>(null)

  const { registerField, defaultValue = '', fieldName, error } = useField(name)
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue })

  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isErrored, setIsErrored] = useState<boolean>(false)
  const [isFilled, setIsFilled] = useState<boolean>(false)

  useEffect(() => {
    setIsErrored(!!error)
  }, [error])

  const handleOnFocus = useCallback(focused => {
    setIsFocused(focused)

    if (focused) {
      setIsErrored(false)
    }
  }, [])

  const handleOnTextChange = useCallback(value => {
    inputValueRef.current.value = value

    setIsFilled(!!inputValueRef.current.value)
    setIsErrored(false)
  }, [])

  useImperativeHandle(parentRef, () => ({
    focus() {
      inputElementRef.current.focus()
    },
  }))

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value
        inputElementRef.current.setNativeProps({ text: value })
      },
      clearValue() {
        inputValueRef.current.value = ''
        inputElementRef.current.clear()
      },
    })
  }, [fieldName, registerField])

  return (
    <Container isFocused={isFocused} isErrored={!!isErrored}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />

      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onChangeText={handleOnTextChange}
        onFocus={() => handleOnFocus(true)}
        onBlur={() => handleOnFocus(false)}
        {...rest}
      />
    </Container>
  )
}

export default forwardRef(Input)
