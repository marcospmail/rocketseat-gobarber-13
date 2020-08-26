import { Router } from 'express'
import multer from 'multer'

import CreateUserService from '../services/CreateUserService'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'

import ensureAuthenticated from '../middlewars/ensureAuthenticated'

import multerConfig from '../config/upload'

const routes = Router()

const multerInstance = multer(multerConfig)

routes.post('/', async (req, res) => {
  const { name, email, password } = req.body

  const createUserService = new CreateUserService()

  const newUser = await createUserService.execute({ name, email, password })

  return res.json(newUser)
})

routes.patch(
  '/avatar',
  ensureAuthenticated,
  multerInstance.single('avatar'),
  async (req, res) => {
    const updateUserAvatarService = new UpdateUserAvatarService()

    const user_id = req.user.id

    const user = await updateUserAvatarService.execute({
      user_id,
      avatarFilename: req.file.filename,
    })

    return res.json(user)
  },
)

export default routes
