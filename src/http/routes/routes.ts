import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { createUserRoute } from '../controllers/register/create-user'
import { signInRoute } from '../controllers/register/session'
import { searchPetRoute } from '../controllers/pets/search'
import { petDetailsRoute } from '../controllers/pets/details'
import { addPetRoute } from '../controllers/pets/add'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', createUserRoute)
  app.post('/login', signInRoute)
}

export async function petRoutes(app: FastifyInstance) {
  app.get('/', searchPetRoute)
  app.get('/:id', petDetailsRoute)
  app.post('/', { onRequest: [verifyJwt] }, addPetRoute)
}
