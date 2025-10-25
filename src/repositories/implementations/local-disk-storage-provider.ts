import fs from 'node:fs/promises'
import path from 'node:path'
import type { StorageProvider } from '../storage-provider'
import { TMP_FOLDER, UPLOADS_FOLDER } from '@/config/upload'

export class LocalDiskStorageProvider implements StorageProvider {
  async save(tempFileName: string) {
    const tempFilePath = path.resolve(TMP_FOLDER, tempFileName)
    const permanentFilePath = path.resolve(UPLOADS_FOLDER, tempFileName)

    try {
      await fs.rename(tempFilePath, permanentFilePath)
      return tempFileName
    } catch (err) {
      console.error(err)
      throw new Error('File not found')
    }
  }
  delete(fileKey: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
