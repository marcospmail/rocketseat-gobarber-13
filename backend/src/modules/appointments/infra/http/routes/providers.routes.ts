import { Router } from 'express'

import ensureAuthenticated from '@modules/users/infra/http/middlewars/ensureAuthenticated'
import ProvidersController from '../controllers/ProvidersController'

const routes = Router()
const appointmentsController = new ProvidersController()

routes.use(ensureAuthenticated)

routes.get('/', appointmentsController.index)

export default routes
