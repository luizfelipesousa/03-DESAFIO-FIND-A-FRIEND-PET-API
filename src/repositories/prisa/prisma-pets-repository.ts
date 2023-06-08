import { Prisma, Pet } from '@prisma/client'
import { PetRepository } from '../pet-repository'
import { prisma } from '../../lib/prisma'
import { SearchCriteria } from '../../services/pet-service'

export class PrismaPetsRepository implements PetRepository {
  async createPet(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({ where: { id } })
    return pet
  }

  async findPetInfoById(id: string): Promise<Pet | null> {
    const petInfo = await prisma.pet.findFirst({
      where: {
        id,
        AND: {
          adopted_by: null,
        },
      },
    })

    return petInfo
  }

  async findBySearchCriteria({
    color,
    gender,
    species,
    q,
    orgs,
  }: SearchCriteria): Promise<Pet[]> {
    const pets = await prisma.pet.findMany({
      where: {
        color,
        gender,
        species,
        name: {
          contains: q,
        },
        org_id: {
          in: orgs?.map((org) => org.id),
        },
        AND: {
          adopted_by: null,
        },
      },
    })

    return pets
  }
}
