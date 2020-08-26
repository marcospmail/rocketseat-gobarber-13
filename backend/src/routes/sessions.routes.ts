import { Router } from 'express'
import AuthenticateSessionService from '../services/AuthenticateSessionService'

const routes = Router()

routes.post('/', async (req, res) => {
  const { email, password } = req.body

  const authenticateSessionService = new AuthenticateSessionService()

  const { user, token } = await authenticateSessionService.execute({
    email,
    password,
  })

  return res.json({ user, token })
})

export default routes
