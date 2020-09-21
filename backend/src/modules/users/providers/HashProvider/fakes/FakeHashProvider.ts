import IHashProvider from '../models/IHashProvider'

class FakeHashProvider implements IHashProvider {
  public async hash(password: string): Promise<string> {
    return password
  }

  public async compare(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return password === hashedPassword
  }
}

export default FakeHashProvider
