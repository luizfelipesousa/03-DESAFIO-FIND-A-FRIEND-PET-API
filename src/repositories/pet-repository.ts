import { Pet, Prisma } from '@prisma/client'
import { SearchCriteria } from '../services/pet-service'

export interface PetRepository {
  createPet(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  findPetInfoById(id: string): Promise<Pet | null>
  findBySearchCriteria(searchCriteria: SearchCriteria): Promise<Pet[]>
}
