import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createGetPetAdoptionInfoServiceFactory } from '../../../services/factories/make-get-pet-adoption-info-service'

export async function adoptPetRoute(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const petIdSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = petIdSchema.parse(request.params)

  const petService = createGetPetAdoptionInfoServiceFactory()
  const petDetail = await petService.execute(id)

  return reply.status(200).send({ petDetail })
}
