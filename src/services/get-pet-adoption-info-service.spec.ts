import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { User } from '@prisma/client'
import { GetPetAdoptionInfoService } from './get-pet-adoption-info-service'
import { createUser } from '../utils/test/create-user-for-unit-test'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'
import { CreatePetService } from './create-pet-service'

let petRepo: InMemoryPetsRepository
let userRepo: InMemoryUserRepository
let sut: GetPetAdoptionInfoService
let orgUser: User
let petId: string

describe('Get Pet Adoption Information Service Tests', () => {
  beforeEach(async () => {
    petRepo = new InMemoryPetsRepository()
    userRepo = new InMemoryUserRepository()
    sut = new GetPetAdoptionInfoService(petRepo, userRepo)
    const createPet = new CreatePetService(petRepo, userRepo)

    orgUser = await createUser({
      repository: userRepo,
      email: 'org',
      role: 'ORG',
    })

    petId = await createPet.execute({
      color: 'brown',
      gender: 'female',
      name: 'delta',
      orgId: orgUser.id,
      species: 'cat',
    })
  })

  it('Should be possible get pet adoption information', async () => {
    const { orgInfo } = await sut.execute(petId)
    expect(orgInfo).toEqual(
      expect.objectContaining({
        contact: expect.stringContaining('https://wa.me/'),
      }),
    )
  })

  it('Should not be possible get pet adoption information if pet id does not exists', async () => {
    await expect(sut.execute('non-exist-pet-id')).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    )
  })
})
