import { Router } from 'express'
import multer from 'multer'
import { celebrate, Segments, Joi } from 'celebrate'

import multerConfig from '@config/upload'
import ensureAuthenticated from '@modules/users/infra/http/middlewars/ensureAuthenticated'
import UserController from '../controllers/UserController'
import UserAvatarController from '../controllers/UserAvatarController'

const routes = Router()
const userController = new UserController()
const userAvatarController = new UserAvatarController()

const multerInstance = multer(multerConfig)

routes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }),
  userController.create
)

routes.patch(
  '/avatar',
  ensureAuthenticated,
  multerInstance.single('avatar'),
  userAvatarController.update
)

export default routes
