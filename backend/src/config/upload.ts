import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

const tmpPath = path.resolve(__dirname, '..', '..', 'tmp')

export default {
  tmp: tmpPath,
  directory: path.resolve(tmpPath, 'uploads'),
  storage: multer.diskStorage({
    destination: tmpPath,
    filename: (req, file, callback) => {
      let newFilename = crypto.randomBytes(8).toString('hex')
      newFilename += `-${file.originalname}`

      return callback(null, newFilename)
    }
  })
}
