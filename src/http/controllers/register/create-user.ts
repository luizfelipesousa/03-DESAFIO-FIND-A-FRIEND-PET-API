import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { phoneRegex } from '../../../utils/phone-number-regex'

export async function createUserRoute(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createUserSchema = z.object({
    name: z.string(),
    whatsapp: z.string().regex(phoneRegex, 'Invalid Number'),
    country: z.string().max(255),
    state: z.string().max(255),
    city: z.string().max(255),
    address: z.string().max(255),
    zipcode: z.coerce.number(),
    type: z.enum(['user', 'org']),
    email: z.string().email(),
    password: z.string(),
  })

  const user = createUserSchema.parse(request.body)

  return reply.status(201).send(user)
}
