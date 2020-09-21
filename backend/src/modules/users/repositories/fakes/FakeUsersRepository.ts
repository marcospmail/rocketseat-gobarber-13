import { v4 } from 'uuid'

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async findById(id: string): Promise<User | undefined> {
    const userFound = this.users.find(u => u.id === id)

    return userFound
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userFound = this.users.find(u => u.email === email)

    return userFound
  }

  public async create(user: ICreateUserDTO): Promise<User> {
    const newUser = new User()

    Object.assign(newUser, { id: v4() }, user)

    this.users.push(newUser)

    return newUser
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === user.id)

    this.users[userIndex] = user

    return user
  }
}

export default FakeUsersRepository
