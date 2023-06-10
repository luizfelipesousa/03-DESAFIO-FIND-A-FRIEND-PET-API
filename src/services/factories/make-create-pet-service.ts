import { PrismaPetsRepository } from '../../repositories/prisa/prisma-pets-repository'
import { PrismaUserRepository } from '../../repositories/prisa/prisma-user-repository'
import { CreatePetService } from '../create-pet-service'

export function createPetService() {
  const petRepo = new PrismaPetsRepository()
  const userRepo = new PrismaUserRepository()
  return new CreatePetService(petRepo, userRepo)
}
