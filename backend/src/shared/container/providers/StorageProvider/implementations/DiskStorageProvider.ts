import fs from 'fs'
import path from 'path'

import uploadConfig from '@config/upload'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

class DiskStorageProvider implements IStorageProvider {
  public async save(filename: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmp, filename),
      path.resolve(uploadConfig.directory, filename)
    )

    return filename
  }

  public async delete(filename: string): Promise<void> {
    try {
      await fs.promises.stat(filename)
    } catch {
      return
    }

    await fs.promises.unlink(filename)
  }
}

export default DiskStorageProvider
