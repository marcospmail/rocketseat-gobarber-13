import { Router } from 'express'

import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes'
import usersRoutes from '@modules/users/infra/http/routes/users.routes'
import profileRoutes from '@modules/users/infra/http/routes/profile.routes'
import passwordRoutes from '@modules/users/infra/http/routes/password.routes'
import appointmentsRoutes from '@modules/appointments/infra/http/routes/appointments.routes'
import providersController from '@modules/appointments/infra/http/routes/providers.routes'

const routes = Router()

routes.use('/sessions', sessionsRoutes)
routes.use('/users', usersRoutes)
routes.use('/profile', profileRoutes)
routes.use('/appointments', appointmentsRoutes)
routes.use('/providers', providersController)
routes.use('/password', passwordRoutes)

export default routes
