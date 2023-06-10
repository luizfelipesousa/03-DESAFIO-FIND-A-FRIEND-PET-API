import { PrismaPetsRepository } from '../../repositories/prisa/prisma-pets-repository'
import { PrismaUserRepository } from '../../repositories/prisa/prisma-user-repository'
import { GetPetAdoptionInfoService } from '../get-pet-adoption-info-service'

export function createGetPetAdoptionInfoServiceFactory() {
  const petRepo = new PrismaPetsRepository()
  const userRepo = new PrismaUserRepository()
  return new GetPetAdoptionInfoService(petRepo, userRepo)
}
