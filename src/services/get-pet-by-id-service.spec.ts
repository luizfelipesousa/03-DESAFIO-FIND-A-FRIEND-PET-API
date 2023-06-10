import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { User } from '@prisma/client'
import { createUser } from '../utils/test/create-user-for-unit-test'
import { GetPetByIdService } from './get-pet-by-id-service'
import { CreatePetService } from './create-pet-service'

let petRepo: InMemoryPetsRepository
let userRepo: InMemoryUserRepository
let sut: GetPetByIdService
let orgUser: User
let petId: string

describe('Get Pet By Id Service Tests', () => {
  beforeEach(async () => {
    petRepo = new InMemoryPetsRepository()
    userRepo = new InMemoryUserRepository()
    sut = new GetPetByIdService(petRepo, userRepo)

    orgUser = await createUser({
      repository: userRepo,
      email: 'org',
      role: 'ORG',
    })
  })

  it('Should be possible get pet by id', async () => {
    const createPet = new CreatePetService(petRepo, userRepo)
    petId = await createPet.execute({
      color: 'black',
      gender: 'male',
      name: 'doggy',
      orgId: orgUser.id,
      species: 'dog',
    })

    const result = await sut.execute(petId)
    expect(result).toEqual(expect.objectContaining({ name: 'doggy' }))
  })

  it('Should not be possible get pet by an invalid id', async () => {
    const result = await sut.execute('non-existent-pet-id')
    expect(result).toEqual({})
  })
})
