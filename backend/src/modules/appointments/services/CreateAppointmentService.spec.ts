import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import AppError from '@shared/errors/AppError'
import { addDays } from 'date-fns'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

describe('CreateAppointment', () => {
  let fakeAppointmentsRepository: FakeAppointmentsRepository
  let fakeNotificationsRepository: FakeNotificationsRepository
  let createAppointmentsService: CreateAppointmentService
  let fakeCacheProvider: FakeCacheProvider

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeNotificationsRepository = new FakeNotificationsRepository()
    fakeCacheProvider = new FakeCacheProvider()

    createAppointmentsService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    )
  })

  it('should be able to create a new appointment', async () => {
    const provider_id = 'some-provider-id'
    const user_id = 'some-user-id'

    const date = addDays(new Date(), 1)
    date.setHours(8)

    const createNotificationFunction = jest.spyOn(
      fakeNotificationsRepository,
      'create'
    )

    const createdAppointment = await createAppointmentsService.execute({
      date,
      provider_id,
      user_id
    })

    expect(createdAppointment).toHaveProperty('id')
    expect(createdAppointment.provider_id).toBe(provider_id)

    expect(createNotificationFunction).toBeCalled()
  })

  it('should not be able to create two appointments at same date', async () => {
    const provider_id = 'some-provider-id'
    const user_id = 'some-user-id'

    const date = addDays(new Date(), 1)
    date.setHours(8)

    await createAppointmentsService.execute({
      date,
      provider_id,
      user_id
    })

    await expect(
      createAppointmentsService.execute({
        date,
        provider_id,
        user_id
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create appointment before current time', async () => {
    const provider_id = 'some-provider-id'
    const user_id = 'some-user-id'

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 1, 8, 30).getTime()
    })

    const date = new Date(2020, 9, 1, 8, 45)

    await expect(
      createAppointmentsService.execute({
        date,
        provider_id,
        user_id
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create appointment before 8am or after 5pm', async () => {
    const provider_id = 'some-provider-id'
    const user_id = 'some-user-id'

    const beforeWorkingHoursDate = new Date(2020, 9, 1, 7)

    await expect(
      createAppointmentsService.execute({
        date: beforeWorkingHoursDate,
        provider_id,
        user_id
      })
    ).rejects.toBeInstanceOf(AppError)

    const afterWorkingHoursDate = new Date(2020, 9, 1, 18)

    await expect(
      createAppointmentsService.execute({
        date: afterWorkingHoursDate,
        provider_id,
        user_id
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create appointment with same user as provider', async () => {
    const provider_id = 'same-user-id'
    const user_id = 'same-user-id'

    const date = new Date()
    addDays(date, 1)
    date.setHours(8)

    await expect(
      createAppointmentsService.execute({
        date,
        provider_id,
        user_id
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
