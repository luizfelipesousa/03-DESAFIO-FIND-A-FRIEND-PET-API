import { PrismaPetsRepository } from '../../repositories/prisa/prisma-pets-repository'
import { PrismaUserRepository } from '../../repositories/prisa/prisma-user-repository'
import { PetService } from '../pet-service'

export function createPetServiceFactory() {
  const petRepo = new PrismaPetsRepository()
  const userRepo = new PrismaUserRepository()
  const petService = new PetService(petRepo, userRepo)
  return petService
}
