import { FastifyInstance } from 'fastify'
import { addPetRoute } from './pets/add'
import { petDetailsRoute } from './pets/details'
import { searchPetRoute } from './pets/search'
import { signInRoute } from './register/session'
import { createUserRoute } from './register/create-user'
import { verifyJwt } from '../../middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', createUserRoute)
  app.post('/login', signInRoute)
}

export async function petRoutes(app: FastifyInstance) {
  app.get('/', searchPetRoute)
  app.get('/:id', petDetailsRoute)
  app.post('/', { onRequest: [verifyJwt] }, addPetRoute)
}
