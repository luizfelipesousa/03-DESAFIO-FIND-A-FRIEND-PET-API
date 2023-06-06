import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function signInRoute(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const user = createUserSchema.parse(request.body)

  const token = await reply.jwtSign({ user })

  reply.setCookie('sessionId', token, {
    path: '/',
  })

  return reply.status(200).send({ token })
}
