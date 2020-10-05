import { format, getHours, isBefore, startOfHour } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  async execute({
    provider_id,
    user_id,
    date
  }: IRequest): Promise<Appointment> {
    const newAppointmentDate = startOfHour(date)

    if (user_id === provider_id) {
      throw new AppError('Cant book an appointment with yourself')
    }

    const currentDate = new Date(Date.now())

    if (isBefore(newAppointmentDate, currentDate)) {
      throw new AppError('Cant book an appointment on past dates')
    }

    if (getHours(newAppointmentDate) < 8 || getHours(newAppointmentDate) > 17) {
      throw new AppError('Cant book an appointment before 8am or after 5pm')
    }

    const appointmentInSameDate = await this.appointmentsRepository.findByDate(
      newAppointmentDate,
      provider_id
    )

    if (appointmentInSameDate) {
      throw new AppError('Date unavailable', 401)
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: newAppointmentDate
    })

    const content = format(newAppointmentDate, "dd/MM/yyyy 'às' HH:mm")

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${content}`
    })

    const cacheKey = `appointments:${provider_id}:${format(
      newAppointmentDate,
      'yyyy-M-d'
    )}`

    await this.cacheProvider.invalidate(cacheKey)

    return appointment
  }
}

export default CreateAppointmentService
