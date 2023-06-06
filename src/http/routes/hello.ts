import { FastifyInstance } from 'fastify'

export async function helloRoute(app: FastifyInstance): Promise<void> {
  app.get('/', (req, reply) => {
    reply.status(200).send({ message: 'Hello' })
  })
}
