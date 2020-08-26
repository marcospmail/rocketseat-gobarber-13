import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import authConfig from '../config/auth'
import AppError from '../errors/AppError'

interface TokenPayload {
  iat: number
  exp: number
  sub: string
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { authorization } = req.headers

  if (!authorization) {
    throw new AppError('Missing JWT token', 401)
  }

  const [, token] = authorization.split(' ')

  const decoded = verify(token, authConfig.jwt.secret)

  const { sub } = decoded as TokenPayload

  req.user = {
    id: sub,
  }

  return next()
}
