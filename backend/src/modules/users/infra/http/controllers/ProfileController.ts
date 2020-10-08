import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import ShowProfileService from '@modules/users/services/ShowProfileService'
import UpdateProfileService from '@modules/users/services/UpdateProfileService'

class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id

    const showProfileService = container.resolve(ShowProfileService)

    const userProfile = await showProfileService.execute({ user_id })

    return res.json(userProfile)
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id

    console.log('caiuuuu')

    const { name, email, password, old_password } = req.body

    const updateProfileService = container.resolve(UpdateProfileService)

    const user = await updateProfileService.execute({
      user_id,
      email,
      name,
      password,
      old_password
    })

    return res.json(classToClass(user))
  }
}

export default ProfileController
