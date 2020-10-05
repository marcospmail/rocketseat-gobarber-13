import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService'

describe('ListProviderMonthAvailability', () => {
  let appointmentsRepository: IAppointmentsRepository
  let listProviderMonthAvailability: ListProviderMonthAvailabilityService

  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository()
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      appointmentsRepository
    )
  })

  it('should be able to list all provider appointments of a month', async () => {
    const provider_id = 'some-provider-id'
    const user_id = 'some-user-id'

    const startHour = 8
    const daysArray = Array.from(
      { length: 10 },
      (_, index) => index + startHour
    )

    daysArray.map(async day => {
      await appointmentsRepository.create({
        provider_id,
        user_id,
        date: new Date(2020, 9, 2, day, 0, 0)
      })
    })

    await appointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 9, 3, 10, 0, 0)
    })

    const monthAppointments = await listProviderMonthAvailability.execute({
      provider_id,
      month: 10,
      year: 2020
    })

    expect(monthAppointments).toEqual(
      expect.arrayContaining([
        { day: 1, available: true },
        { day: 2, available: false },
        { day: 3, available: true }
      ])
    )
  })
})
