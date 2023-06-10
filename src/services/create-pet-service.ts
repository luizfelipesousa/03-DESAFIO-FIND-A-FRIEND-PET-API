import { PetRepository } from '../repositories/pet-repository'
import { UserRepository } from '../repositories/user-repository'
import { AccessNotGrantedException } from './errors/access-not-granted-exception'

interface PetInfo {
  name: string
  species: string
  gender: string
  color: string
  orgId: string
}

export class CreatePetService {
  constructor(
    private petRepo: PetRepository,
    private userRepo: UserRepository,
  ) {}

  async execute(pet: PetInfo) {
    const isAnOrg = await this.userRepo.findUserByIdAndRole(pet.orgId, 'ORG')

    const { name, color, gender, species } = pet
    if (isAnOrg) {
      const petAdded = await this.petRepo.createPet({
        name,
        color,
        gender,
        species,
        org_id: pet.orgId,
      })

      return petAdded.id
    }

    throw new AccessNotGrantedException()
  }
}
