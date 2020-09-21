import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService'
import AppError from '@shared/errors/AppError'

describe('UpdateUserAvatarService', () => {
  let fakeUsersRepository: FakeUsersRepository
  let fakeStorageProvider: FakeStorageProvider

  let updateUserAvatarService: UpdateUserAvatarService

  it('should be able to update the user avatar', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeStorageProvider = new FakeStorageProvider()

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    const newUser = await fakeUsersRepository.create({
      email: 'email@example.com',
      name: 'John Doe',
      password: '123456'
    })

    const avatarFilename = 'avatar.png'

    const user = await updateUserAvatarService.execute({
      user_id: newUser.id,
      avatarFilename
    })

    expect(user.avatar).toBe(avatarFilename)
  })

  it('should not be able to change user avatar with an invalid user id', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeStorageProvider = new FakeStorageProvider()

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    await expect(
      updateUserAvatarService.execute({
        user_id: 'invalid-user-id',
        avatarFilename: 'avatar.png'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should delete old user avatar file when updating to a new one', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeStorageProvider = new FakeStorageProvider()

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    const deleteFunction = jest.spyOn(fakeStorageProvider, 'delete')

    const newUser = await fakeUsersRepository.create({
      email: 'email@example.com',
      name: 'John Doe',
      password: '123456'
    })

    const oldAvatarFilename = 'old_avatar.png'
    const newAvatarFilename = 'new_avatar.png'

    await updateUserAvatarService.execute({
      user_id: newUser.id,
      avatarFilename: oldAvatarFilename
    })

    await updateUserAvatarService.execute({
      user_id: newUser.id,
      avatarFilename: newAvatarFilename
    })

    expect(deleteFunction).toBeCalledTimes(1)
    expect(deleteFunction).toBeCalledWith(oldAvatarFilename)
  })
})
