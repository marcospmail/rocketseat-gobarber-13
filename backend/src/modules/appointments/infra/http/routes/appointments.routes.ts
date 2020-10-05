import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import ensureAuthenticated from '@modules/users/infra/http/middlewars/ensureAuthenticated'
import AppointmentsController from '../controllers/AppointmentsController'
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController'
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController'
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController'

const routes = Router()
const appointmentsController = new AppointmentsController()
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController()
const providerDayAvailabilityController = new ProviderDayAvailabilityController()
const providerAppointmentsController = new ProviderAppointmentsController()

routes.use(ensureAuthenticated)

routes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required()
    }
  }),
  appointmentsController.create
)
routes.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.BODY]: {
      month: Joi.number().integer().min(1).max(12).required(),
      year: Joi.number().required().positive()
    }
  }),
  providerMonthAvailabilityController.index
)
routes.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.BODY]: {
      day: Joi.number().required().positive().min(1).max(31),
      month: Joi.number().integer().min(1).max(12).required(),
      year: Joi.number().required().positive()
    }
  }),
  providerDayAvailabilityController.index
)

routes.get('/schedule', providerAppointmentsController.index)

export default routes
