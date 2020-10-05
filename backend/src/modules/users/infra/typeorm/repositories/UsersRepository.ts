import { getRepository, Not, Repository } from 'typeorm'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO'
import User from '../entities/User'

class UsersRepository implements IUsersRepository {
  private usersRepository: Repository<User>

  constructor() {
    this.usersRepository = getRepository(User)
  }

  public async findAllProviders({
    except_user_id
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users

    if (except_user_id) {
      users = this.usersRepository.find({
        where: {
          id: Not(except_user_id)
        }
      })
    } else {
      users = this.usersRepository.find()
    }

    return users
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
