import { User } from '@prisma/client'
import { PetRepository } from '../repositories/pet-repository'
import { UserRepository } from '../repositories/user-repository'

export interface SearchCriteria {
  location?: string
  q: string | undefined
  species: string | undefined
  color: string | undefined
  gender: string | undefined
  orgs?: User[]
}

export class SearchPetService {
  constructor(
    private petRepo: PetRepository,
    private userRepo: UserRepository,
  ) {}

  async execute(searchCriterias: SearchCriteria) {
    const { color, gender, species, q, location } = searchCriterias

    const orgs = await this.userRepo.findUsersByLocation(location ?? '')

    const pets = await this.petRepo.findBySearchCriteria({
      color,
      gender,
      species,
      q,
      orgs,
    })

    return pets || []
  }
}
