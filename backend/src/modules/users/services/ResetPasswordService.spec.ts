import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository'
import ResetPasswordService from './ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokenRepository: FakeUserTokenRepository
let fakeHashProvider: FakeHashProvider
let resetPasswordService: ResetPasswordService

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokenRepository = new FakeUserTokenRepository()

    fakeHashProvider = new FakeHashProvider()

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeUserTokenRepository
    )
  })

  it('should be able to reset password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'example@email.com',
      name: 'John Doe',
      password: 'old-password'
    })

    const token = await fakeUserTokenRepository.generate(user.id)

    await resetPasswordService.execute({
      token: token.token,
      password: 'new-password'
    })

    expect(user.password).toBe('new-password')
  })

  it('should not be able to reset password with invalid token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'invalid-token',
        password: 'new-password'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset password of non-existing user', async () => {
    const token = await fakeUserTokenRepository.generate('non-existing-id')

    await expect(
      resetPasswordService.execute({
        token: token.token,
        password: 'new-password'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'example@email.com',
      password: '123456'
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()

      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(
      resetPasswordService.execute({
        password: '123456',
        token
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
