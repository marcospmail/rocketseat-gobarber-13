import { Router } from 'express'

import sessionsRoutes from './sessions.routes'
import appointmentsRoutes from './appointments.routes'
import usersRoutes from './users.routes'

const routes = Router()

routes.use('/sessions', sessionsRoutes)
routes.use('/users', usersRoutes)
routes.use('/appointments', appointmentsRoutes)

export default routes
