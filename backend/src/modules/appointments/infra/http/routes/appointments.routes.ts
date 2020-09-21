import { Router } from 'express'

import ensureAuthenticated from '@modules/users/infra/http/middlewars/ensureAuthenticated'
import AppointmentsController from '../controllers/AppointmentsController'

const routes = Router()
const appointmentsController = new AppointmentsController()

routes.use(ensureAuthenticated)

routes.post('/', appointmentsController.create)

export default routes
