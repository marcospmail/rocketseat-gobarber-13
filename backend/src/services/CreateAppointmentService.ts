import { getCustomRepository } from 'typeorm'
import { startOfHour } from 'date-fns'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import Appointment from '../models/Appointment'
import AppError from '../errors/AppError'

interface Request {
  provider_id: string
  date: Date
}

class CreateAppointmentService {
  async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)

    const newAppointmentDate = startOfHour(date)

    const appointmentInSameDate = await appointmentsRepository.findByDate(
      newAppointmentDate,
    )

    if (appointmentInSameDate) {
      throw new AppError('Date unavailable', 401)
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: newAppointmentDate,
    })

    await appointmentsRepository.save(appointment)

    return appointment
  }
}

export default CreateAppointmentService
