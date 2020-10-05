import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import IUsersRepository from '../repositories/IUsersRepository'
import ShowProfileService from './ShowProfileService'

describe('ShowProfile', () => {
  let fakeUsersRepository: IUsersRepository
  let showProfileService: ShowProfileService

  it('should be able to show profile', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    showProfileService = new ShowProfileService(fakeUsersRepository)

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'old_email@email.com',
      password: 'old-password'
    })

    const userProfile = await showProfileService.execute({
      user_id: user.id
    })

    expect(userProfile.id).toBe(user.id)
    expect(userProfile.name).toBe(user.name)
  })

  it('should not be able to show non-existing user profile', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    showProfileService = new ShowProfileService(fakeUsersRepository)

    await expect(
      showProfileService.execute({
        user_id: 'non-existing-id'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
