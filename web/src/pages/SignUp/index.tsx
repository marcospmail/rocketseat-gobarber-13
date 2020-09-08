import React, { useCallback, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi'
import * as Yup from 'yup'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useToast } from '../../hooks/toast'

import getValidationErrors from '../../utils/getValidationErrors'

import api from '../../services/api'

import logo from '../../assets/logo.svg'
import { Container, Content, Background } from './styles'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
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

      await api.post('users', data)
      addToast({
        type: 'success',
        message: 'Usuário cadastrado',
        description: 'Agora você já pode fazer o login com seu usuário',
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
        message: 'Erro no cadastro',
        description: 'Ocorreu um erro ao fazer o cadastro, tente novamente',
      })
    }
  }, [])

  return (
    <Container>
      <Background />

      <Content>
        <img src={logo} alt="GoBarber logo." />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>

          <Input icon={FiUser} name="name" placeholder="Nome" />
          <Input icon={FiMail} name="email" placeholder="E-mail" />
          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <Link to="/">
          <FiArrowLeft />
          Voltar para logon
        </Link>
      </Content>
    </Container>
  )
}

export default SignUp
