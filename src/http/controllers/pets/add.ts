import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function addPetRoute(req: FastifyRequest, reply: FastifyReply) {
  const createPetSchema = z.object({
    name: z.string(),
    species: z.string().max(255),
    gender: z.enum(['male', 'female']),
    color: z.string().max(90),
    orgId: z.string().uuid(),
  })

  const pet = createPetSchema.parse(req.body)

  return reply.status(200).send({ pet })
}
