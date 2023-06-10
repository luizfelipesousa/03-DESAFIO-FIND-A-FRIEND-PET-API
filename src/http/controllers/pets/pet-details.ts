import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createGetPetByIdService } from '../../../services/factories/make-get-pet-by-id-service'

export async function petDetailsRoute(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const petIdSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = petIdSchema.parse(request.params)

  const petService = createGetPetByIdService()
  const petDetail = await petService.execute(id)

  return reply.status(200).send({ petDetail })
}
