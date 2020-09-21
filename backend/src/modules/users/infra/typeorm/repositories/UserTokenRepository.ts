import { getRepository, Repository } from 'typeorm'

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'
import UserToken from '../entities/UserToken'

class UsersTokenRepository implements IUserTokenRepository {
  private ormRepository: Repository<UserToken>

  constructor() {
    this.ormRepository = getRepository(UserToken)
  }

  public async generate(user_id: string): Promise<UserToken> {
    const newUserToken = this.ormRepository.create({
      user_id
    })

    await this.ormRepository.save(newUserToken)

    return newUserToken
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: {
        token
      }
    })

    return userToken
  }
}

export default UsersTokenRepository
