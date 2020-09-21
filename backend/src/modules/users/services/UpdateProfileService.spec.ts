import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import IUsersRepository from '../repositories/IUsersRepository'
import UpdateProfileService from './UpdateProfileService'

describe('UpdateProfile', () => {
  let fakeUsersRepository: IUsersRepository
  let fakeHashProvider: IHashProvider
  let updateProfileService: UpdateProfileService

  it('should be able to update the profile', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    )

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'old_email@email.com',
      password: 'old-password'
    })

    const newName = 'Another John Doe'
    const newEmail = 'new_email@email.com'

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: newName,
      email: newEmail
    })

    expect(updatedUser.name).toBe(newName)
    expect(updatedUser.email).toBe(newEmail)
  })

  it('should not be able to update an invalid user', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    )

    await expect(
      updateProfileService.execute({
        user_id: 'invalid-user-id',
        name: 'anything',
        email: 'anything'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    )

    const oldPassword = 'old-password'
    const newPassword = 'new-password'

    const user = await fakeUsersRepository.create({
      email: 'example@email.com',
      name: 'John Doe',
      password: oldPassword
    })

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: user.name,
      email: user.email,
      old_password: oldPassword,
      password: newPassword
    })

    expect(updatedUser.password).toBe(newPassword)
  })

  it('should not be able to update the password with invalid old password', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    )

    const user = await fakeUsersRepository.create({
      email: 'example@email.com',
      name: 'John Doe',
      password: 'old-password'
    })

    const newPassword = 'new-password'

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        old_password: 'invalid-old-password',
        password: newPassword
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the password with no old password', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    )

    const user = await fakeUsersRepository.create({
      email: 'example@email.com',
      name: 'John Doe',
      password: 'old-password'
    })

    const newPassword = 'new-password'

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        password: newPassword
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
