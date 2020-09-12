import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import authConfig from '../config/auth'

import User from '../models/User'
import AppError from '../errors/AppError'

interface Request {
  email: string
  password: string
}

interface Response {
  user: Omit<User, 'password'>
  token: string
}

class AuthenticateSessionService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User)

    const user = await usersRepository.findOne({ where: { email } })

    if (!user) {
      throw new AppError('Invalid email/password')
    }

    const validPassword = await compare(password, user.password)

    if (!validPassword) {
      throw new AppError('Invalid email/password')
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...responseUser } = user

    return { user: responseUser, token }
  }
}

export default AuthenticateSessionService
