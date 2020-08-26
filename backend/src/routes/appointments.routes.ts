import { getCustomRepository } from 'typeorm'
import { Router } from 'express'
import { parseISO } from 'date-fns'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService'
import ensureAuthenticated from '../middlewars/ensureAuthenticated'

const routes = Router()

routes.use(ensureAuthenticated)

routes.get('/', async (_, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  const allAppointments = await appointmentsRepository.find()

  return res.json(allAppointments)
})

routes.post('/', async (req, res) => {
  const { provider_id, date } = req.body

  const parsedDate = parseISO(date)

  const createAppointmentsService = new CreateAppointmentService()

  const createdAppointment = await createAppointmentsService.execute({
    provider_id,
    date: parsedDate,
  })

  return res.json(createdAppointment)
})

export default routes
