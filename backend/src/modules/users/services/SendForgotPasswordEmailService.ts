import path from 'path'
import { injectable, inject } from 'tsyringe'

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import IUserTokenRepository from '../repositories/IUserTokenRepository'

interface IRequest {
  email: string
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('User does not exists')
    }

    const templateFilePath = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs'
    )

    const { token } = await this.userTokenRepository.generate(user.id)

    await this.mailProvider.sendEmail({
      to: {
        name: user.name,
        email: user.email
      },
      subject: '[GoBarber] Recuperação de Senha',
      templateData: {
        file: templateFilePath,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`
        }
      }
    })
  }
}

export default SendForgotPasswordEmailService
