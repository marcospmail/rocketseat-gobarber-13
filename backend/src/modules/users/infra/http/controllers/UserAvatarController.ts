import { Request, Response } from 'express'
import { container } from 'tsyringe'

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService'

class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService)

    const user_id = req.user.id

    const user = await updateUserAvatarService.execute({
      user_id,
      avatarFilename: req.file.filename
    })

    return res.json(user)
  }
}

export default UserAvatarController
