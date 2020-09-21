import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokenRepository: FakeUserTokenRepository
let fakeMailProvider: FakeMailProvider
let sendForgotPasswordEmailService: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokenRepository = new FakeUserTokenRepository()
    fakeMailProvider = new FakeMailProvider()
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeMailProvider
    )
  })

  it('should be able to send forgot password email', async () => {
    const sendEmailFunction = jest.spyOn(fakeMailProvider, 'sendEmail')

    const userEmail = 'example@email.com'

    await fakeUsersRepository.create({
      email: userEmail,
      name: 'John Doe',
      password: '123456'
    })

    await sendForgotPasswordEmailService.execute({ email: userEmail })

    expect(sendEmailFunction).toBeCalled()
  })

  it('should not be able to send forgot password email to user that does not exists', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({ email: 'example@email.com' })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should generated user token when sending forgot password email', async () => {
    const generateUserTokenFunction = jest.spyOn(
      fakeUserTokenRepository,
      'generate'
    )

    const user = await fakeUsersRepository.create({
      email: 'example@email.com',
      name: 'John Doe',
      password: '123456'
    })

    await sendForgotPasswordEmailService.execute({ email: user.email })

    expect(generateUserTokenFunction).toBeCalledWith(user.id)
  })
})
