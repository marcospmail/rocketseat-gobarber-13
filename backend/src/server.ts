import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'

import uploadConfig from './config/upload'
import routes from './routes'

import './database'
import AppError from './errors/AppError'

const app = express()

app.use(express.json())

app.use(routes)
app.use('/files', express.static(uploadConfig.directory))

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    const appError = err as AppError
    return res.status(appError.statusCode).json({
      status: 'error',
      message: appError.message,
    })
  }

  console.log(err)

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

app.listen(3333)
