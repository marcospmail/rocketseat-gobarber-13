import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

class FakeStorageProvider implements IStorageProvider {
  private files: string[] = []

  public async save(filename: string): Promise<string> {
    this.files.push(filename)

    return filename
  }

  public async delete(filename: string): Promise<void> {
    this.files = this.files.filter(f => f !== filename)
  }
}

export default FakeStorageProvider
