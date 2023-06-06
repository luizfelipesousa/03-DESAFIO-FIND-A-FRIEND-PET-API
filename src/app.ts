import { fastify } from 'fastify'
import { petRoutes, userRoutes } from './http/routes/routes'
import { ZodError } from 'zod'
import { env } from 'process'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyJwt, { secret: 'supersecret' })
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

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  }

  return reply.status(500).send({
    message: 'Internal Server error.',
  })
})
