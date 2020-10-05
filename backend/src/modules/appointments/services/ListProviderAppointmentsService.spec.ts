import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import ListProviderAppointmentsService from './ListProviderAppointmentsService'

describe('ListProviderAppointmentsService', () => {
  let appointmentsRepository: IAppointmentsRepository
  let listProviderAppointmentsService: ListProviderAppointmentsService
  let fakeCacheProvider: FakeCacheProvider

  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository()
    fakeCacheProvider = new FakeCacheProvider()
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      appointmentsRepository,
      fakeCacheProvider
    )
  })

  it('should be albe to list all provider appointments from day', async () => {
    const provider_id = 'some-provider-id'
    const user_id = 'some-user-id'

    const appointment1 = await appointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 9, 1, 8)
    })

    const appointment2 = await appointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 9, 1, 9)
    })

    const appointments = await listProviderAppointmentsService.execute({
      provider_id,
      day: 1,
      month: 10,
      year: 2020
    })

    expect(appointments).toEqual([appointment1, appointment2])
  })
})
