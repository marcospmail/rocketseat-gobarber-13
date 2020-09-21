import { hash, compare } from 'bcryptjs'

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'

class BCryptHashProvider implements IHashProvider {
  public async hash(password: string): Promise<string> {
    return hash(password, 8)
  }

  public async compare(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return compare(password, hashedPassword)
  }
}

export default BCryptHashProvider
