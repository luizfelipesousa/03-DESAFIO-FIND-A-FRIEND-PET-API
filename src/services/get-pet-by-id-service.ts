import { PetRepository } from '../repositories/pet-repository'
import { UserRepository } from '../repositories/user-repository'

export class GetPetByIdService {
  constructor(
    private petRepo: PetRepository,
    private userRepo: UserRepository,
  ) {}

  async execute(petId: string) {
    const pet = await this.petRepo.findById(petId)
    return { ...pet }
  }
}
