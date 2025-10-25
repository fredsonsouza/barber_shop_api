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
  async delete(fileKey: string) {
    const filePath = path.resolve(UPLOADS_FOLDER, fileKey)

    try {
      await fs.stat(filePath)
    } catch {
      return
    }
    try {
      await fs.unlink(filePath)
    } catch (err) {
      console.error('Error deleting file:', err)
      throw new Error('Error deleting file')
    }
  }
}
