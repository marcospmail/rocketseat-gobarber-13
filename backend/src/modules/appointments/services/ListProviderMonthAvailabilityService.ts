import { getDate, getDaysInMonth, isAfter } from 'date-fns'
import { injectable, inject } from 'tsyringe'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  month: number
  year: number
}

type IResponse = Array<{
  day: number
  available: boolean
}>

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year
  }: IRequest): Promise<IResponse> {
    const monthAppointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year
      }
    )

    const daysInMonth = getDaysInMonth(new Date(year, month - 1))

    const daysArray = Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    )

    const daysAvailability = daysArray.map(day => {
      const dayAppointments = monthAppointments.filter(
        appointment => getDate(appointment.date) === day
      )

      const appointmentDate = new Date(year, month - 1, day, 17)
      const pastDate = isAfter(new Date(), appointmentDate)

      return {
        day,
        available: !pastDate && dayAppointments.length < 10
      }
    })

    return daysAvailability
  }
}

export default ListProviderMonthAvailabilityService
