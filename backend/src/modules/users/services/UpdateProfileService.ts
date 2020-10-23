import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import User from '../infra/typeorm/entities/User'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  user_id: string
  name: string
  email: string
  old_password?: string
  password?: string
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User does not exists')
    }

    user.name = name
    user.email = email

    if (password && !old_password) {
      throw new AppError('You need to inform the old password to set a new one')
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compare(
        old_password,
        user.password
      )

      if (!checkOldPassword) {
        throw new AppError('Invalid old password')
      }

      user.password = await this.hashProvider.hash(password)
    }

    const updatedUser = await this.usersRepository.save(user)

    await this.cacheProvider.invalidatePrefix('providers-list')

    return updatedUser
  }
}

export default UpdateProfileService
