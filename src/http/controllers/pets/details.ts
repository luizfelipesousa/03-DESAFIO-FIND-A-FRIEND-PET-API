import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function petDetailsRoute(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const petIdSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = petIdSchema.parse(request.params)

  return reply.status(200).send({ id })
}
