import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { User } from '@prisma/client'
import { AccessNotGrantedException } from './errors/access-not-granted-exception'
import { CreatePetService } from './create-pet-service'
import { createUser } from '../utils/test/create-user-for-unit-test'

let petRepo: InMemoryPetsRepository
let userRepo: InMemoryUserRepository
let sut: CreatePetService
let orgUser: User
let memberUser: User

describe('Create pet scenarios', () => {
  beforeEach(async () => {
    petRepo = new InMemoryPetsRepository()
    userRepo = new InMemoryUserRepository()
    sut = new CreatePetService(petRepo, userRepo)

    orgUser = await createUser({
      repository: userRepo,
      role: 'ORG',
      email: 'org',
    })
  })

  it('Should be possible to create a pet if the user role is "ORG"', async () => {
    const pet = await sut.execute({
      color: 'white',
      gender: 'male',
      name: 'doggy',
      orgId: orgUser.id,
      species: 'dog',
    })
    expect(pet).toEqual(expect.any(String))
  })

  it('Should not be possible to create a pet if the user role is "MEMBER"', async () => {
    memberUser = await createUser({
      repository: userRepo,
      role: 'MEMBER',
      email: 'member',
    })

    await expect(
      sut.execute({
        color: 'white',
        gender: 'male',
        name: 'doggy',
        orgId: memberUser.id,
        species: 'dog',
      }),
    ).rejects.toBeInstanceOf(AccessNotGrantedException)
  })

  it('Should not be possible to create a pet if the org does not exists', async () => {
    await expect(
      sut.execute({
        color: 'white',
        gender: 'male',
        name: 'doggy',
        orgId: 'non-exist-org',
        species: 'dog',
      }),
    ).rejects.toBeInstanceOf(AccessNotGrantedException)
  })
})
