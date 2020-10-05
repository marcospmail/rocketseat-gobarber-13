import { getRepository, Raw, Repository } from 'typeorm'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthFromProvider from '@modules/appointments/dtos/IFindAllInMonthFromProvider'
import IFindAllInDayFromProvider from '@modules/appointments/dtos/IFindAllInDayFromProvider'
import { addBusinessDays } from 'date-fns'

class AppointmentsRepository implements IAppointmentsRepository {
  ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year
  }: IFindAllInDayFromProvider): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0')
    const parsedMonth = String(month).padStart(2, '0')

    const dayAppointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          fieldname =>
            `to_char(${fieldname}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        )
      }
    })

    return dayAppointments
  }

  findAllInMonthFromProvider({
    provider_id,
    month,
    year
  }: IFindAllInMonthFromProvider): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0')

    const monthAppointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          fieldname =>
            `to_char(${fieldname}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        )
      }
    })

    return monthAppointments
  }

  public async create({
    provider_id,
    user_id,
    date
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date
    })

    await this.ormRepository.save(appointment)

    return appointment
  }

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({
      where: {
        date,
        provider_id
      }
    })

    return appointment
  }
}

export default AppointmentsRepository
