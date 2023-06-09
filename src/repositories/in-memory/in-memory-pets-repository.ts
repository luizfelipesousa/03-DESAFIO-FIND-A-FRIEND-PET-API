import { Prisma, Pet } from '@prisma/client'
import { PetRepository } from '../pet-repository'
import { SearchCriteria } from '../../services/pet-service'
import { randomUUID } from 'node:crypto'

const pets: Pet[] = []

export class InMemoryPetsRepository implements PetRepository {
  async createPet(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = {
      id: randomUUID(),
      ...data,
      created_at: new Date(),
      update_at: null,
      adopted_by: null,
    }

    pets.push(pet)

    return pet
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = pets.find((p) => p.id === id)
    return pet ?? null
  }

  async findPetInfoById(id: string): Promise<Pet | null> {
    const petInfo = pets.find((p) => p.id === id && p.adopted_by === null)
    return petInfo ?? null
  }

  async findBySearchCriteria({
    color,
    gender,
    species,
    q,
    orgs,
  }: SearchCriteria): Promise<Pet[]> {
    const listOfPets = pets.filter(
      (p) =>
        (p.color === color ||
          p.gender === gender ||
          p.species === species ||
          p.name.includes(q ?? '')) &&
        orgs?.map((org) => org.id).includes(p.org_id),
    )

    return listOfPets
  }
}
