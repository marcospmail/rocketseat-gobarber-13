import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import ensureAuthenticated from '@modules/users/infra/http/middlewars/ensureAuthenticated'
import ProfileController from '../controllers/ProfileController'

const routes = Router()
const profileController = new ProfileController()

routes.use(ensureAuthenticated)
routes.get(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      password: Joi.string().required(),
      old_password: Joi.string().required()
    }
  }),
  profileController.show
)

routes.post('/', profileController.update)

export default routes
