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
    private hashProvider: IHashProvider
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

    if (password) {
      if (!old_password || old_password !== user.password) {
        throw new AppError('Invalid old password')
      }

      user.password = password
    }

    const updatedUser = await this.usersRepository.save(user)

    return updatedUser
  }
}

export default UpdateProfileService
