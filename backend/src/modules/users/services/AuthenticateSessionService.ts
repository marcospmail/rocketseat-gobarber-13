import { sign } from 'jsonwebtoken'
import { injectable, inject } from 'tsyringe'
import { classToClass } from 'class-transformer'

import User from '@modules/users/infra/typeorm/entities/User'
import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: Omit<User, 'password'>
  token: string
}

@injectable()
class AuthenticateSessionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Invalid email/password')
    }

    const validPassword = await this.hashProvider.compare(
      password,
      user.password
    )

    if (!validPassword) {
      throw new AppError('Invalid email/password')
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    })

    return { user: classToClass(user), token }
  }
}

export default AuthenticateSessionService
