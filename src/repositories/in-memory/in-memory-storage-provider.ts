import { randomUUID } from 'node:crypto'
import type { StorageProvider } from '../storage-provider'

export class InMemorySTorageProvider implements StorageProvider {
  public files: string[] = []
  async save(tempFileName: string) {
    this.files.push(tempFileName)

    return tempFileName
  }
  async delete(fileKey: string) {
    const fileIndex = this.files.findIndex((file) => file === fileKey)

    if (fileIndex >= 0) {
      this.files.splice(fileIndex, 1)
    }
  }
}
