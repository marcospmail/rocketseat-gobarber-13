import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService'

describe('ListProviderDayAvailability', () => {
  let appointmentsRepository: IAppointmentsRepository
  let listProviderDayAvailability: ListProviderDayAvailabilityService

  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository()
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      appointmentsRepository
    )
  })

  it('should be able to list all provider appointments of a day', async () => {
    const provider_id = 'some-provider-id'
    const user_id = 'some-user-id'

    await appointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 9, 1, 14, 0, 0)
    })

    await appointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 9, 1, 15, 0, 0)
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 1, 13).getTime()
    })

    const hoursAvailability = await listProviderDayAvailability.execute({
      provider_id,
      day: 1,
      month: 10,
      year: 2020
    })

    expect(hoursAvailability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: false },

        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true }
      ])
    )
  })
})
