import { FastifyInstance } from 'fastify'
import { addPetRoute } from './pets/add-pet'
import { petDetailsRoute } from './pets/pet-details'
import { searchPetRoute } from './pets/search-pet'
import { signInRoute } from './register/session'
import { createUserRoute } from './register/create-user'
import { adoptPetRoute } from './pets/adopt-pet'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', createUserRoute)
  app.post('/login', signInRoute)
}

export async function petRoutes(app: FastifyInstance) {
  app.get('/', searchPetRoute)
  app.get('/:id', petDetailsRoute)
  app.get('/:id/adopt', adoptPetRoute)
  app.post('/', { onRequest: [verifyJwt] }, addPetRoute)
}
