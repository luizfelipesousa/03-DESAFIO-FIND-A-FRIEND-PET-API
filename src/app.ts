import { fastify } from 'fastify'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { petRoutes, userRoutes } from './http/controllers/routes'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'
import { InvalidCredentialsException } from './errors/invalid-credentials-exception'
import { AccessNotGrantedException } from './errors/access-not-granted-exception'
import { env } from './env'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'refreshToken', signed: false },
  sign: { expiresIn: '20m' },
})
app.register(fastifyCookie)
app.register(userRoutes, { prefix: 'user' })
app.register(petRoutes, { prefix: 'pets' })

app.setErrorHandler((error, req, reply) => {
  if (error instanceof ZodError) {
    return reply.status(404).send({
      message: 'Validation error.',
      error: error.format(),
    })
  }

  if (error instanceof ResourceNotFoundException) {
    return reply.status(404).send({
      message: error.message,
    })
  }

  if (error instanceof AccessNotGrantedException) {
    return reply.status(403).send({
      message: error.message,
    })
  }

  if (error instanceof InvalidCredentialsException) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  if (env.NODE_ENV !== 'prod') {
    console.log(error)
  }

  return reply.status(500).send({
    message: 'Internal Server error.',
  })
})
