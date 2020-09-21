interface IStorageProvider {
  save(filename: string): Promise<string>
  delete(filename: string): Promise<void>
}

export default IStorageProvider
