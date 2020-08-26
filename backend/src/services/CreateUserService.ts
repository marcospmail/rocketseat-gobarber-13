import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import User from '../models/User'
import AppError from '../errors/AppError'

interface Request {
  name: string
  email: string
  password: string
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User)

    const emailAlreadyRegistered = await usersRepository.findOne({
      where: { email },
    })

    if (emailAlreadyRegistered) {
      throw new AppError('Email already registered')
    }

    const userPassword = await hash(password, 8)

    const newUser = usersRepository.create({
      name,
      email,
      password: userPassword,
    })

    await usersRepository.save(newUser)

    delete newUser.password

    return newUser
  }
}

export default CreateUserService
