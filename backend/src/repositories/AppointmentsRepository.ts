import { Repository, EntityRepository } from 'typeorm'
import { startOfHour, isEqual } from 'date-fns'

import Appointment from '../models/Appointment'

interface CreateAppointmentDTO {
  provider: string
  date: Date
}

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    const appointment = await this.findOne({
      where: {
        date,
      },
    })

    return appointment || null
  }
}

export default AppointmentsRepository
