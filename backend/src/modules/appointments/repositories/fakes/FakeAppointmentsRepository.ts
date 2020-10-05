import { v4 } from 'uuid'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IFindAllInMonthFromProvider from '@modules/appointments/dtos/IFindAllInMonthFromProvider'
import IFindAllInDayFromProvider from '@modules/appointments/dtos/IFindAllInDayFromProvider'
import IAppointmentsRepository from '../IAppointmentsRepository'

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = []

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year
  }: IFindAllInDayFromProvider): Promise<Appointment[]> {
    const dayAppointments = this.appointments.filter(
      a =>
        a.provider_id === provider_id &&
        getDate(a.date) === day &&
        getMonth(a.date) + 1 === month &&
        getYear(a.date) === year
    )

    return dayAppointments
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year
  }: IFindAllInMonthFromProvider): Promise<Appointment[]> {
    const monthAppointments = this.appointments.filter(
      a =>
        a.provider_id === provider_id &&
        getMonth(a.date) + 1 === month &&
        getYear(a.date) === year
    )

    return monthAppointments
  }

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    const newAppointment = new Appointment()

    Object.assign(newAppointment, { id: v4(), ...data })

    this.appointments.push(newAppointment)

    return newAppointment
  }

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    const appointmentFound = this.appointments.find(a => {
      return isEqual(a.date, date) && a.provider_id === provider_id
    })

    return appointmentFound
  }
}

export default FakeAppointmentsRepository
