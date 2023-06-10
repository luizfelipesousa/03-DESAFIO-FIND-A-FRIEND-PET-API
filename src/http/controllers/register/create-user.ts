import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { phoneRegex } from '../../../utils/phone-number-regex'
import { createUserService } from '../../../services/factories/make-create-user-service'

export async function createUserRoute(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createUserSchema = z.object({
    name: z.string(),
    contact: z.string().regex(phoneRegex, 'Invalid Number'),
    country: z.string().max(255),
    state: z.string().max(255),
    city: z.string().max(255),
    address: z.string().max(255),
    zipcode: z.coerce.number(),
    role: z.enum(['MEMBER', 'ORG']).default('MEMBER'),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const user = createUserSchema.parse(request.body)

  const userService = createUserService()

  const userCreated = await userService.execute(user)

  return reply.status(201).send({ id: userCreated.id })
}
