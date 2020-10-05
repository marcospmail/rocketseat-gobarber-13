import { getHours, isAfter } from 'date-fns'
import { injectable, inject } from 'tsyringe'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

type IResponse = Array<{
  hour: number
  available: boolean
}>

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year
  }: IRequest): Promise<IResponse> {
    const dayAppointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year
      }
    )

    const startHour = 8
    const hoursArray = Array.from(
      { length: 10 },
      (_, index) => index + startHour
    )

    const currentTime = new Date(Date.now())

    const hoursAvailability = hoursArray.map(hour => {
      const hasAppointmentInThisHour = dayAppointments.filter(
        appointment => getHours(appointment.date) === hour
      )

      const appointmentDate = new Date(year, month - 1, day, hour)
      const passedTime = isAfter(currentTime, appointmentDate)

      return {
        hour,
        available: !hasAppointmentInThisHour.length && !passedTime
      }
    })

    return hoursAvailability
  }
}

export default ListProviderDayAvailabilityService
