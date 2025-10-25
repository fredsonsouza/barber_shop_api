import path from 'node:path'

const appDir = path.resolve(process.cwd())

export const TMP_FOLDER = path.resolve(appDir, 'tmp')
export const UPLOADS_FOLDER = path.resolve(appDir, 'uploads')
