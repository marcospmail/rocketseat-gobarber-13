import { Request, Response } from 'express'

import AuthenticateSessionService from '@modules/users/services/AuthenticateSessionService'
import { container } from 'tsyringe'

class SessionController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    const authenticateSessionService = container.resolve(
      AuthenticateSessionService
    )

    const { user, token } = await authenticateSessionService.execute({
      email,
      password
    })

    return res.json({ user, token })
  }
}

export default SessionController
