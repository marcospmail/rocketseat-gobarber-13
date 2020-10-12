import React, { useRef, useCallback } from 'react'
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/mobile'
import * as Yup from 'yup'
import Icon from 'react-native-vector-icons/Feather'
import ImagePicker from 'react-native-image-picker'

import { useAuth } from '../../contexts/auth'

import api from '../../services/api'
import * as Defaults from '../../utils/defaults'
import getScreenHeight from '../../utils/getScreenHeight'
import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import {
  Container,
  Title,
  Content,
  Avatar,
  AvatarImage,
  BackButton
} from './styles'
import { RotationGestureHandler } from 'react-native-gesture-handler'

interface SignUpFormData {
  name: string
  email: string
  old_password: string
  password: string
  password_confirmation: string
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()
  const { navigate, goBack } = useNavigation()

  const screenHeight = getScreenHeight()

  const formRef = useRef<FormHandles>(null)
  const emailRef = useRef<TextInput>(null)
  const oldPasswordRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)
  const passwordConfirmationRef = useRef<TextInput>(null)

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'User câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria'
      },
      response => {
        if (response.didCancel) return

        if (response.error) {
          Alert.alert('Erro ao atualizar avatar')
          return
        }

        const data = new FormData()

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user?.id}.jpg`,
          uri: response.uri
        })

        api
          .patch('users/avatar', data)
          .then(apiResponse => updateUser(apiResponse.data))
      }
    )
  }, [updateUser, user])

  const handleFormSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string()
          }),
          password_confirmation: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string()
              .required('Campo obrigatório')
              .oneOf(
                [Yup.ref('password')],
                'Confirmação do Password não confere'
              ),
            otherwise: Yup.string()
          })
        })
        await schema.validate(data, {
          abortEarly: false
        })

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation
        } = data

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation
              }
            : {})
        }

        const response = await api.put('profile', formData)

        await updateUser(response.data)

        Alert.alert('Seus dados foram atualizados')

        navigate('Dashboard')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }

        Alert.alert(
          'Erro',
          'Ocorreu um erro ao salvar as informações, tente novamente mais tarde'
        )
      }
    },
    [navigate, updateUser]
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
          <BackButton
            onPress={() => {
              goBack()
            }}
          >
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>

          <Content>
            <Avatar onPress={handleUpdateAvatar}>
              <AvatarImage
                source={{ uri: user?.avatar_url ?? Defaults.images.avatar_url }}
              />
            </Avatar>

            <Title>Meu perfil</Title>

            <Form
              ref={formRef}
              onSubmit={handleFormSubmit}
              initialData={{
                name: user?.name,
                email: user?.email
              }}
            >
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
                  oldPasswordRef.current?.focus()
                }}
              />

              <Input
                ref={oldPasswordRef}
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                containerStyle={{ marginTop: 10 }}
                secureTextEntry={true}
              />

              <Input
                ref={passwordRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                returnKeyType="next"
                onSubmitEditing={() => passwordConfirmationRef.current?.focus()}
                secureTextEntry={true}
              />

              <Input
                ref={passwordConfirmationRef}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmação"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
                secureTextEntry={true}
              />

              <Button
                style={{ marginTop: 10 }}
                onPress={() => formRef.current?.submitForm()}
              >
                Salvar
              </Button>
            </Form>
          </Content>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Profile
