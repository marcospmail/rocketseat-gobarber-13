import React, { useEffect } from 'react'
import { FiAlertCircle, FiXCircle } from 'react-icons/fi'

import { ToastMessage, useToast } from '../../../hooks/toast'

import { Container } from './styles'

interface ToastProps {
  style: Record<string, unknown>
  message: ToastMessage
}

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id)
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <Container
      key={message.id}
      hasDescription={!!message.description}
      type={message.type}
      style={style}
    >
      <FiAlertCircle size={20} />

      <div>
        <strong>{message.message}</strong>

        {!!message.description && <p>{message.description}</p>}
      </div>

      <button onClick={() => removeToast(message.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  )
}

export default Toast
