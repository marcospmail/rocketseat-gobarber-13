import { startOfHour } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const newAppointmentDate = startOfHour(date)

    const appointmentInSameDate = await this.appointmentsRepository.findByDate(
      newAppointmentDate
    )

    if (appointmentInSameDate) {
      throw new AppError('Date unavailable', 401)
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: newAppointmentDate
    })

    return appointment
  }
}

export default CreateAppointmentService
