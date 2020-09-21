import AppError from '@shared/errors/AppError'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

describe('Create Appointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointmentsService = new CreateAppointmentService(
      fakeAppointmentsRepository
    )

    const provider_id = '1'

    const createdAppointment = await createAppointmentsService.execute({
      date: new Date(),
      provider_id
    })

    expect(createdAppointment).toHaveProperty('id')
    expect(createdAppointment.provider_id).toBe(provider_id)
  })

  it('should not be able to create two appointments at same date', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointmentsService = new CreateAppointmentService(
      fakeAppointmentsRepository
    )

    const provider_id = '1'
    const date = new Date()

    await createAppointmentsService.execute({
      date,
      provider_id
    })

    await expect(
      createAppointmentsService.execute({
        date,
        provider_id
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
