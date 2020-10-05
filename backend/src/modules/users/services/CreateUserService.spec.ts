import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'

describe('CreateUser', () => {
  let fakeUsersRepository: FakeUsersRepository
  let fakeHashProvider: FakeHashProvider
  let createUserService: CreateUserService
  let fakeCacheProvider: FakeCacheProvider

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    )
  })

  it('should be able to create a new user', async () => {
    const newUser = await createUserService.execute({
      email: 'email@example.com',
      name: 'John Doe',
      password: '123456'
    })
    expect(newUser).toHaveProperty('id')
  })

  it('should not be able to create user with same email', async () => {
    const email = 'email@example.com'

    await createUserService.execute({
      email,
      name: 'John Doe',
      password: '123456'
    })

    await expect(
      createUserService.execute({
        email,
        name: 'Another John Doe',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
