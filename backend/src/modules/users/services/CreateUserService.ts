import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

interface IRequest {
  name: string
  email: string
  password: string
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    name,
    email,
    password
  }: IRequest): Promise<Omit<User, 'password'>> {
    const emailAlreadyRegistered = await this.usersRepository.findByEmail(email)

    if (emailAlreadyRegistered) {
      throw new AppError('Email already registered')
    }

    const userPassword = await this.hashProvider.hash(password)

    const newUser = await this.usersRepository.create({
      name,
      email,
      password: userPassword
    })

    await this.usersRepository.save(newUser)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...returnNewUser } = newUser

    return returnNewUser
  }
}

export default CreateUserService
