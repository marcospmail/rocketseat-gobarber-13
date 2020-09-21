import { getRepository, Repository } from 'typeorm'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

import User from '../entities/User'

class UsersRepository implements IUsersRepository {
  private usersRepository: Repository<User>

  constructor() {
    this.usersRepository = getRepository(User)
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne(id)
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: {
        email
      }
    })
  }

  public async create(user: ICreateUserDTO): Promise<User> {
    const newUser = this.usersRepository.create(user)

    await this.usersRepository.save(newUser)

    return newUser
  }

  public async save(user: User): Promise<User> {
    return this.usersRepository.save(user)
  }
}

export default UsersRepository
