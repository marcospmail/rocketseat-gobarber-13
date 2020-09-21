import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import AuthenticateSessionService from './AuthenticateSessionService'
import CreateUserService from './CreateUserService'

describe('AuthenticateSessionService', () => {
  let fakeUsersRepository: FakeUsersRepository
  let fakeHashProvider: FakeHashProvider

  let createUserService: CreateUserService

  let authenticateSessionService: AuthenticateSessionService

  it('should be able to authenticate', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )

    authenticateSessionService = new AuthenticateSessionService(
      fakeUsersRepository,
      fakeHashProvider
    )

    const user = {
      email: 'email@example.com',
      name: 'John Doe',
      password: '123456'
    }

    await createUserService.execute(user)

    const authenticatedUser = await authenticateSessionService.execute({
      email: user.email,
      password: user.password
    })

    expect(authenticatedUser).toHaveProperty('token')
    expect(authenticatedUser).toHaveProperty('user')
    expect(authenticatedUser.user).toHaveProperty('id')
    expect(authenticatedUser.user).toHaveProperty('name')
    expect(authenticatedUser.user).toHaveProperty('email')
    expect(authenticatedUser.user).not.toHaveProperty('password')
  })

  it('should not be able to authenticate with non created user', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    authenticateSessionService = new AuthenticateSessionService(
      fakeUsersRepository,
      fakeHashProvider
    )

    await expect(
      authenticateSessionService.execute({
        email: 'email@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )

    authenticateSessionService = new AuthenticateSessionService(
      fakeUsersRepository,
      fakeHashProvider
    )

    const user = {
      email: 'email@example.com',
      name: 'John Doe',
      password: '123456'
    }

    await createUserService.execute(user)

    await expect(
      authenticateSessionService.execute({
        email: user.email,
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
