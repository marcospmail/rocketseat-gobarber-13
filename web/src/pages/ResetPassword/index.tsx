import React, { useCallback, useRef, useMemo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { FiLock } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useToast } from '../../hooks/toast'

import logo from '../../assets/logo.svg'
import { Container, Content, Background } from './styles'
import api from '../../services/api'

interface PasswordResetFormData {
  password: string
  password_confirmation: string
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { addToast } = useToast()
  const history = useHistory()
  const location = useLocation()

  const token = useMemo(() => {
    return new URLSearchParams(location.search).get('token')
  }, [location.search])

  const handleSubmit = useCallback(
    async (data: PasswordResetFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Confirmação do Password não confere'
          ),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        const { password, password_confirmation } = data

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        })

        addToast({
          type: 'success',
          message: 'Senha alterada',
          description: 'Você já pode entrar com sua nova senha',
        })

        history.push('/')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          message: 'Erro na autenticação',
          description: 'Ocorreu um erro ao resetar sua senha',
        })
      }
    },
    [addToast, history, token]
  )

  return (
    <Container>
      <Content>
        <img src={logo} alt="GoBarber logo." />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Resete sua senha</h1>

          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Senha"
          />

          <Input
            icon={FiLock}
            name="password_confirmation"
            type="password"
            placeholder="Confirmação da Senha"
          />

          <Button type="submit">Resetar senha</Button>
        </Form>
      </Content>

      <Background />
    </Container>
  )
}

export default ResetPassword
