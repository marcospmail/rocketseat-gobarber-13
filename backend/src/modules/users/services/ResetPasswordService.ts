import AppError from '@shared/errors/AppError'
import { addHours, isAfter } from 'date-fns'
import { inject, injectable } from 'tsyringe'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'
import IUserTokenRepository from '../repositories/IUserTokenRepository'

interface IRequest {
  token: string
  password: string
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token)

    if (!userToken) {
      throw new AppError('User token does not exists')
    }

    const user = await this.usersRepository.findById(userToken.user_id)

    if (!user) {
      throw new AppError('User does not exists')
    }

    const tokenExpireTime = addHours(userToken.created_at, 2)

    if (isAfter(Date.now(), tokenExpireTime)) {
      throw new AppError('Has passed more than 2 hours, token invalid')
    }

    user.password = await this.hashProvider.hash(password)

    await this.usersRepository.save(user)
  }
}

export default ResetPasswordService
