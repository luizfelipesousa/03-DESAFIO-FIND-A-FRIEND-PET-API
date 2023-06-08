import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createPetServiceFactory } from '../../../services/factory/make-pet-service-factory'

export async function petDetailsRoute(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const petIdSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = petIdSchema.parse(request.params)

  const petService = createPetServiceFactory()
  const petDetail = await petService.getPetById(id)

  return reply.status(200).send({ petDetail })
}
