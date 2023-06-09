import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { PetService } from './pet-service'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { Decimal } from '@prisma/client/runtime'
import { User } from '@prisma/client'
import { AccessNotGrantedException } from './errors/access-not-granted-exception'

let petRepo: InMemoryPetsRepository
let userRepo: InMemoryUserRepository
let sut: PetService
let orgUser: User
let memberUser: User

describe('Pet Service Tests', () => {
  beforeEach(async () => {
    petRepo = new InMemoryPetsRepository()
    userRepo = new InMemoryUserRepository()
    sut = new PetService(petRepo, userRepo)

    orgUser = await userRepo.createUser({
      id: 'org-user',
      name: 'Org Test',
      country: 'test country',
      state: 'test state',
      city: 'test city',
      address: 'test-adress',
      zipcode: new Decimal(4545465),
      contact: '9999999999',
      email: 'org-user@org.pet',
      role: 'ORG',
      created_at: new Date(),
      password: 'password',
    })

    memberUser = await userRepo.createUser({
      id: 'member-user',
      name: 'member Test',
      country: 'test country',
      state: 'test state',
      city: 'test city',
      address: 'test-adress',
      zipcode: new Decimal(4545465),
      contact: '9999999999',
      email: 'member-user@member.pet',
      role: 'MEMBER',
      created_at: new Date(),
      password: 'password',
    })
  })

  describe('Create pet scenarios', () => {
    it('Should be possible to create a pet if the user role is "ORG"', async () => {
      const pet = await sut.createPet({
        color: 'white',
        gender: 'male',
        name: 'doggy',
        orgId: orgUser.id,
        species: 'dog',
      })
      expect(pet).toEqual(expect.any(String))
    })

    it('Should not be possible to create a pet if the user role is "MEMBER"', async () => {
      await expect(
        sut.createPet({
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
        sut.createPet({
          color: 'white',
          gender: 'male',
          name: 'doggy',
          orgId: 'non-exist-org',
          species: 'dog',
        }),
      ).rejects.toBeInstanceOf(AccessNotGrantedException)
    })
  })

  describe('Search for a pet scenarios', () => {
    it('Should be possible get pet by id', async () => {
      const pet = await sut.createPet({
        color: 'white',
        gender: 'male',
        name: 'doggy',
        orgId: orgUser.id,
        species: 'dog',
      })

      const result = await sut.getPetById(pet)
      expect(result).toEqual(expect.objectContaining({ name: 'doggy' }))
    })

    it('Should not be possible get pet by an invalid id', async () => {
      const result = await sut.getPetById('non-existent-pet-id')
      expect(result).toEqual({})
    })

    it('Should be possible to search for a pet', async () => {
      await sut.createPet({
        color: 'brown',
        gender: 'female',
        name: 'delta',
        orgId: orgUser.id,
        species: 'cat',
      })

      const result = await sut.searchPet({
        color: 'brown',
        gender: 'female',
        q: 'delta',
        species: 'cat',
      })
      expect(result).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: 'delta' })]),
      )
    })

    it('Should be possible get pet adoption information', async () => {
      const petId = await sut.createPet({
        color: 'brown',
        gender: 'female',
        name: 'delta',
        orgId: orgUser.id,
        species: 'cat',
      })

      const { orgInfo } = await sut.getInfoToAdoptPet(petId)
      expect(orgInfo).toEqual(
        expect.objectContaining({
          contact: expect.stringContaining('https://wa.me/'),
        }),
      )
    })
  })
})
