import React, { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiLogIn, FiMail } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useToast } from '../../hooks/toast'

import logo from '../../assets/logo.svg'
import { Container, Content, Background } from './styles'

interface SignInFormData {
  email: string
  password: string
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const [loading, setLoading] = useState(false)

  const { addToast } = useToast()

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        setLoading(true)

        await api.post('/password/forgot', {
          email: data.email,
        })

        setLoading(false)

        addToast({
          type: 'success',
          message: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
        })
      } catch (err) {
        setLoading(false)

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }

        let errorMessage =
          'Ocorreu um erro ao enviar email de esquecí minha senha'

        const { response } = err
        if (response.status === 400) {
          errorMessage = response.data.message
        }

        addToast({
          type: 'error',
          message: 'Erro na operação',
          description: errorMessage,
        })
      }
    },
    [addToast]
  )

  return (
    <Container>
      <Content>
        <img src={logo} alt="GoBarber logo." />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Recupere sua senha</h1>

          <Input icon={FiMail} name="email" placeholder="E-mail" />

          <Button loading={loading} type="submit">
            Entrar
          </Button>
        </Form>

        <Link to="/">
          <FiLogIn />
          Voltar para o login
        </Link>
      </Content>

      <Background />
    </Container>
  )
}

export default ForgotPassword
