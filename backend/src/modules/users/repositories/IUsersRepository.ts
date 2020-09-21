import ICreateUserDTO from '../dtos/ICreateUserDTO'
import User from '../infra/typeorm/entities/User'

interface IUsersRepository {
  findById(id: string): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  create(user: ICreateUserDTO): Promise<User>
  save(user: User): Promise<User>
}

export default IUsersRepository
