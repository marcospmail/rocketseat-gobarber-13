import { inject, injectable } from 'tsyringe'
import { classToClass } from 'class-transformer'

import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

interface IRequest {
  user_id: string
  avatarFilename: string
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({
    user_id,
    avatarFilename
  }: IRequest): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User does not exists')
    }

    if (user.avatar) {
      this.storageProvider.delete(user.avatar)
    }
    const filename = await this.storageProvider.save(avatarFilename)

    user.avatar = filename

    await this.usersRepository.save(user)

    return classToClass(user)
  }
}

export default UpdateUserAvatarService
