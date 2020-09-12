import React, { useRef, useCallback } from 'react'
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/mobile'
import * as Yup from 'yup'

import Input from '../../components/Input'
import Button from '../../components/Button'

import getScreenHeight from '../../utils/getScreenHeight'
import getValidationErrors from '../../utils/getValidationErrors'

import logoImg from '../../assets/logo.png'

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from './styles'
import api from '../../services/api'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const screenHeight = getScreenHeight()

  const navigation = useNavigation()

  const formRef = useRef<FormHandles>(null)
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)

  const handleFormSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        api.post('users', data)

        Alert.alert(
          'Usuário cadastrado',
          'Agora você já pode fazer o login com seu usuário',
          [
            {
              text: 'Ok',
              onPress: () => {
                navigation.navigate('SignIn')
              },
            },
          ]
        )
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }

        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer o cadastro, tente novamente'
        )
      }
    },
    [navigation]
  )

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView
        contentContainerStyle={{ minHeight: screenHeight }}
        keyboardShouldPersistTaps="handled"
      >
        <Container>
          <View>
            <Image source={logoImg} />
          </View>
          <Title>Crie sua conta</Title>

          <Form ref={formRef} onSubmit={handleFormSubmit}>
            <Input
              autoCapitalize="words"
              autoCorrect={false}
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailRef.current?.focus()
              }}
            />
            <Input
              ref={emailRef}
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email"
              icon="mail"
              placeholder="Email"
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
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />

            <Button onPress={() => formRef.current?.submitForm()}>
              Cadastrar
            </Button>
          </Form>

          <BackToSignInButton onPress={() => navigation.navigate('SignIn')}>
            <FeatherIcon name="arrow-left" size={20} color="#fff" />
            <BackToSignInButtonText>Voltar para login</BackToSignInButtonText>
          </BackToSignInButton>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignIn
