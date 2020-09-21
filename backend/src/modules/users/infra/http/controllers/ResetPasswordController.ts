import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ResetPasswordService from '@modules/users/services/ResetPasswordService'

class ResetPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { token, password } = req.body

    const resetPasswordEmailService = container.resolve(ResetPasswordService)

    await resetPasswordEmailService.execute({ token, password })

    return res.status(204).json()
  }
}

export default ResetPasswordController
