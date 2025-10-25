export interface StorageProvider {
  save(tempFileName: string): Promise<string>
  delete(fileKey: string): Promise<void>
}
