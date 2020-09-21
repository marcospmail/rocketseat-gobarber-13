import UserToken from '@modules/users/infra/typeorm/entities/UserToken'
import { v4 } from 'uuid'
import IUserTokensRepository from '../IUserTokenRepository'

class FakeUserTokenRepository implements IUserTokensRepository {
  private tokens: UserToken[] = []

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.tokens.find(t => t.token === token)
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken()

    Object.assign(userToken, {
      id: v4(),
      token: v4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date()
    })

    this.tokens.push(userToken)

    return userToken
  }
}

export default FakeUserTokenRepository
