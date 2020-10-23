import React, { useRef, useCallback } from 'react'
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/mobile'
import * as Yup from 'yup'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useAuth } from '../../contexts/auth'

import getValidationErrors from '../../utils/getValidationErrors'
import getScreenHeight from '../../utils/getScreenHeight'

import logoImg from '../../assets/logo.png'

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
} from './styles'

interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const screenHeight = getScreenHeight()

  const formRef = useRef<FormHandles>(null)
  const passwordRef = useRef<TextInput>(null)
  const navigation = useNavigation()
  const { signIn } = useAuth()

  const handleFormSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        signIn({
          email: data.email,
          password: data.password
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }

        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, creque as credenciais'
        )
      }
    },
    [signIn]
  )

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ minHeight: screenHeight }}
      >
        <Container>
          <View>
            <Image source={logoImg} />
          </View>
          <Title>Faça seu login</Title>

          <Form ref={formRef} onSubmit={handleFormSubmit}>
            <Input
              name="email"
              icon="mail"
              placeholder="Email"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordRef.current?.focus()
              }}
            />
            <Input
              ref={passwordRef}
              name="password"
              icon="lock"
              placeholder="Senha"
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm()
              }}
            />

            <Button onPress={() => formRef.current?.submitForm()}>
              Entrar
            </Button>
          </Form>

          <ForgotPassword>
            <ForgotPasswordText>Esquecí minha senha</ForgotPasswordText>
          </ForgotPassword>

          <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
            <FeatherIcon name="log-in" size={20} color="#ff9000" />
            <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
          </CreateAccountButton>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignIn
