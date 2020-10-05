import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO'
import IFindAllInDayFromProvider from '../dtos/IFindAllInDayFromProvider'
import IFindAllInMonthFromProvider from '../dtos/IFindAllInMonthFromProvider'

interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProvider
  ): Promise<Appointment[]>
  findAllInDayFromProvider(
    data: IFindAllInDayFromProvider
  ): Promise<Appointment[]>
}

export default IAppointmentsRepository
