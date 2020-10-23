import React, { ChangeEvent, useCallback, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { FiUser, FiMail, FiLock, FiArrowLeft, FiCamera } from 'react-icons/fi'
import * as Yup from 'yup'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useToast } from '../../hooks/toast'
import { useAuth } from '../../hooks/auth'

import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'
import * as defaults from '../../utils/defaults'

import { Container, Content, AvatarInput } from './styles'

interface ProfileFormData {
  name: string
  email: string
  old_password: string
  password: string
  password_confirmation: string
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const history = useHistory()

  const { user, updateUser } = useAuth()
  const { addToast } = useToast()

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string()
              .required('Campo obrigatório')
              .oneOf(
                [Yup.ref('password')],
                'Confirmação do Password não confere'
              ),
            otherwise: Yup.string(),
          }),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        }

        console.log(formData)

        const response = await api.put('/profile', formData)

        updateUser(response.data)

        addToast({
          type: 'success',
          message: 'Sucesso',
          description: 'Seus dados foram atualizados',
        })

        history.push('/')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }

        console.log(err)

        addToast({
          type: 'error',
          message: 'Erro',
          description: 'Ocorreu um erro ao atualizar o cadastro',
        })
      }
    },
    [addToast, history, updateUser]
  )

  const handleOnAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files) {
          const data = new FormData()

          const file = e.target.files[0]

          data.append('avatar', file)

          api.patch('/users/avatar', data).then(response => {
            updateUser(response.data)

            addToast({
              type: 'success',
              message: 'Foto de profile atualizada',
            })
          })
        }
      } catch (err) {}
    },
    [updateUser, addToast]
  )

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{
            name: user.name,
            email: user.email,
          }}
        >
          <AvatarInput>
            <img
              src={user.avatar_url ?? defaults.images.avatar_url}
              alt={user.name}
            />
            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" id="avatar" onChange={handleOnAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input icon={FiUser} name="name" placeholder="Nome" />
          <Input icon={FiMail} name="email" placeholder="E-mail" />
          <Input
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova Senha"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  )
}

export default Profile
