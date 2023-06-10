import { PrismaPetsRepository } from '../../repositories/prisa/prisma-pets-repository'
import { PrismaUserRepository } from '../../repositories/prisa/prisma-user-repository'
import { SearchPetService } from '../search-pet-service'

export function createSearchPetService() {
  const petRepo = new PrismaPetsRepository()
  const userRepo = new PrismaUserRepository()
  const petService = new SearchPetService(petRepo, userRepo)
  return petService
}
