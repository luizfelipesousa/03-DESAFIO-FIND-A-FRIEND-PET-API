import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { User } from '@prisma/client'
import { createUser } from '../utils/test/create-user-for-unit-test'
import { SearchPetService } from './search-pet-service'
import { CreatePetService } from './create-pet-service'

let petRepo: InMemoryPetsRepository
let userRepo: InMemoryUserRepository
let sut: SearchPetService
let createPetService: CreatePetService
let orgUser: User

describe('Search for a pet scenarios', () => {
  beforeEach(async () => {
    petRepo = new InMemoryPetsRepository()
    userRepo = new InMemoryUserRepository()
    sut = new SearchPetService(petRepo, userRepo)
    createPetService = new CreatePetService(petRepo, userRepo)

    orgUser = await createUser({
      repository: userRepo,
      email: 'org',
      role: 'ORG',
    })
  })

  it('Should be possible to search for a pet', async () => {
    await createPetService.execute({
      color: 'brown',
      gender: 'female',
      name: 'delta',
      orgId: orgUser.id,
      species: 'cat',
    })

    const result = await sut.execute({
      color: 'brown',
      gender: 'female',
      q: 'delta',
      species: 'cat',
    })
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'delta' })]),
    )
  })

  it('Should return an empty list if there is no match', async () => {
    const result = await sut.execute({
      color: 'yellow',
      gender: 'male',
      q: 'pikachu',
      species: 'mouse',
    })
    expect(result).toEqual([])
  })
})
