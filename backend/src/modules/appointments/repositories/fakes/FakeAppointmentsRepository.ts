import { v4 } from 'uuid'
import { isEqual } from 'date-fns'

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../IAppointmentsRepository'

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = []

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    const newAppointment = new Appointment()

    Object.assign(newAppointment, { id: v4(), ...data })

    this.appointments.push(newAppointment)

    return newAppointment
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentFound = this.appointments.find(a => {
      return isEqual(a.date, date)
    })

    return appointmentFound
  }
}

export default FakeAppointmentsRepository
