import { getDate, getDaysInMonth } from 'date-fns'
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

      return {
        day,
        available: dayAppointments.length < 10
      }
    })

    return daysAvailability
  }
}

export default ListProviderMonthAvailabilityService
