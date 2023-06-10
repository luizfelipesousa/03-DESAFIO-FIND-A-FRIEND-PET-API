import { PetRepository } from '../repositories/pet-repository'
import { UserRepository } from '../repositories/user-repository'
import { generateWppNumber } from '../utils/generate-whatsapp-link'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'

export class GetPetAdoptionInfoService {
  constructor(
    private petRepo: PetRepository,
    private userRepo: UserRepository,
  ) {}

  async execute(petId: string) {
    const petInfo = await this.petRepo.findPetInfoById(petId)

    if (!petInfo) {
      throw new ResourceNotFoundException()
    }

    const orgInfo = await this.userRepo.findUserByIdAndRole(
      petInfo.org_id,
      'ORG',
    )

    if (!orgInfo) {
      throw new ResourceNotFoundException()
    }

    const { name, contact, country, state, city, zipcode, address } = orgInfo

    return {
      orgInfo: {
        name,
        contact: generateWppNumber(String(contact)),
        country,
        state,
        city,
        zipcode,
        address,
      },
      petInfo,
    }
  }
}
