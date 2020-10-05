import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import { classToClass } from 'class-transformer'
import { inject, injectable } from 'tsyringe'
import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `appointments:${provider_id}:${year}-${month}-${day}`

    let dayAppointments = await this.cacheProvider.restore<Appointment[]>(
      cacheKey
    )

    if (!dayAppointments) {
      dayAppointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          provider_id,
          day,
          month,
          year
        }
      )

      await this.cacheProvider.save(cacheKey, classToClass(dayAppointments))
    }

    return dayAppointments
  }
}

export default ListProviderAppointmentsService
