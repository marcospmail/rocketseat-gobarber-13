import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateUserService from '@modules/users/services/CreateUserService'

class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body

    const createUserService = container.resolve(CreateUserService)

    const newUser = await createUserService.execute({ name, email, password })

    return res.json(newUser)
  }
}

export default UserController
