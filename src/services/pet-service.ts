import { User } from '@prisma/client'
import { PetRepository } from '../repositories/pet-repository'
import { UserRepository } from '../repositories/user-repository'
import { generateWppNumber } from '../utils/generate-whatsapp-link'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'
import { AccessNotGrantedException } from './errors/access-not-granted-exception'

interface PetInfo {
  name: string
  species: string
  gender: string
  color: string
  orgId: string
}

export interface SearchCriteria {
  location?: string
  q: string | undefined
  species: string | undefined
  color: string | undefined
  gender: string | undefined
  orgs?: User[]
}

export class PetService {
  constructor(
    private petRepo: PetRepository,
    private userRepo: UserRepository,
  ) {}

  async createPet(pet: PetInfo) {
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

  async searchPet(searchCriterias: SearchCriteria) {
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

  async getPetById(petId: string) {
    const pet = await this.petRepo.findById(petId)
    return { ...pet }
  }

  async getInfoToAdoptPet(petId: string) {
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
