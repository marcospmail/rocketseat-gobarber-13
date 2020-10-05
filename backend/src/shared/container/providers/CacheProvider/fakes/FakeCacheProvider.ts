import ICacheProvider from '../models/ICacheProvider'

interface ICacheData {
  [key: string]: string
}

class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {}

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value)
  }

  public async restore<T>(key: string): Promise<T | null> {
    const data = this.cache[key]

    if (!data) return null

    return JSON.parse(data)
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key]
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const filteredKeys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`)
    )

    filteredKeys.forEach(key => delete this.cache[key])
  }
}

export default FakeCacheProvider
