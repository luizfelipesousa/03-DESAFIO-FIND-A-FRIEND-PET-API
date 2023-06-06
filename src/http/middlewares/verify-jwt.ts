import { FastifyRequest, FastifyReply } from 'fastify'

export async function verifyJwt(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify()
  } catch (err) {
    reply.status(401).send({ message: 'Unauthorized.' })
  }
}
