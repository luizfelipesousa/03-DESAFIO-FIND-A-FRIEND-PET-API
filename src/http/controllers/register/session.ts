import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createUserSessionService } from '../../../services/factories/make-create-user-session-service'

export async function signInRoute(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCredentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = createCredentialsSchema.parse(request.body)

  const userService = createUserSessionService()

  const { id, role } = await userService.execute({
    email,
    password,
  })

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: id,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: id,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
