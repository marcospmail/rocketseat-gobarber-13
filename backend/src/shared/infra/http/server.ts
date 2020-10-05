import 'reflect-metadata'
import 'dotenv/config'

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import 'express-async-errors'
import { errors } from 'celebrate'

import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError'
import routes from '@shared/infra/http/routes'
import rateLimiter from './middlewares/rateLimites'

import '@shared/infra/typeorm'
import '@shared/container'

const app = express()

app.use(rateLimiter)
app.use(cors())
app.use(express.json())

app.use('/files', express.static(uploadConfig.directory))
app.use(routes)

app.use(errors())

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    const appError = err as AppError
    return res.status(appError.statusCode).json({
      status: 'error',
      message: appError.message
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

app.listen(3333)
