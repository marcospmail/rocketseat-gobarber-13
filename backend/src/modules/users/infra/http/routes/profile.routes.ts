import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import ensureAuthenticated from '@modules/users/infra/http/middlewars/ensureAuthenticated'
import ProfileController from '../controllers/ProfileController'

const routes = Router()
const profileController = new ProfileController()

routes.use(ensureAuthenticated)
routes.get('/', profileController.show)

routes.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string()
    }
  }),
  profileController.update
)

export default routes
