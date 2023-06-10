import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createPetService } from '../../../services/factories/make-create-pet-service'

export async function addPetRoute(req: FastifyRequest, reply: FastifyReply) {
  const createPetSchema = z.object({
    name: z.string(),
    species: z.string().max(255),
    gender: z.enum(['male', 'female']),
    color: z.string().max(90),
  })

  const petInfo = createPetSchema.parse(req.body)
  const petService = createPetService()
  const data = req.user

  const petId = await petService.execute({ ...petInfo, orgId: data.sub })

  return reply.status(201).send({ petId })
}
