import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createSearchPetService } from '../../../services/factories/make-search-pet-service'

export async function searchPetRoute(req: FastifyRequest, reply: FastifyReply) {
  const searchSchema = z.object({
    location: z.string().max(255),
    q: z.string().max(255).optional(),
    species: z.string().max(255).optional(),
    color: z.string().max(255).optional(),
    gender: z.string().optional(),
  })

  const { location, q, species, color, gender } = searchSchema.parse(req.query)

  const petService = createSearchPetService()
  const pets = await petService.execute({
    location,
    q,
    species,
    color,
    gender,
  })

  return reply.status(200).send({ pets })
}
