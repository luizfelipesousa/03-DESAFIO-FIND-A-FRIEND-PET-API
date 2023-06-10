import { PrismaPetsRepository } from '../../repositories/prisa/prisma-pets-repository'
import { PrismaUserRepository } from '../../repositories/prisa/prisma-user-repository'
import { GetPetByIdService } from '../get-pet-by-id-service'

export function createGetPetByIdService() {
  const petRepo = new PrismaPetsRepository()
  const userRepo = new PrismaUserRepository()
  const petService = new GetPetByIdService(petRepo, userRepo)
  return petService
}
