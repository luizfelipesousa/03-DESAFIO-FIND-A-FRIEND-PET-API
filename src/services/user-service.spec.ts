import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { Decimal } from '@prisma/client/runtime'
import { UserService } from './user-service'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'
import { InvalidCredentialsException } from './errors/invalid-credentials-exception'

let userRepo: InMemoryUserRepository
let sut: UserService

describe('User Service Tests', () => {
  describe('Create User scenarios', () => {
    beforeEach(async () => {
      userRepo = new InMemoryUserRepository()
      sut = new UserService(userRepo)
    })

    it('Should be possible to create a User with role "ORG"', async () => {
      const user = await sut.createUser({
        id: 'org-user',
        name: 'Org Test',
        country: 'test country',
        state: 'test state',
        city: 'test city',
        address: 'test-adress',
        zipcode: new Decimal(4545465),
        contact: '9999999999',
        email: 'org-user@org.User',
        role: 'ORG',
        created_at: new Date(),
        password: 'password',
      })
      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          role: 'ORG',
        }),
      )
    })

    it('Should be possible to create a User with role "MEMBER"', async () => {
      const member = await userRepo.createUser({
        id: 'member-user',
        name: 'member Test',
        country: 'test country',
        state: 'test state',
        city: 'test city',
        address: 'test-adress',
        zipcode: new Decimal(4545465),
        contact: '9999999999',
        email: 'member-user@member.User',
        role: 'MEMBER',
        created_at: new Date(),
        password: 'password',
      })

      expect(member).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          role: 'MEMBER',
        }),
      )
    })

    it('Should not be possible to create a User with existing e-mail', async () => {
      await sut.createUser({
        id: 'org-user',
        name: 'Org Test',
        country: 'test country',
        state: 'test state',
        city: 'test city',
        address: 'test-adress',
        zipcode: new Decimal(4545465),
        contact: '9999999999',
        email: 'org-user@org.user',
        role: 'ORG',
        created_at: new Date(),
        password: 'password',
      })

      await expect(
        sut.createUser({
          id: 'org-user',
          name: 'Another_ Org Test',
          country: 'Another_ test country',
          state: 'Another_ test state',
          city: 'Another_ test city',
          address: 'Another_ test-adress',
          zipcode: new Decimal(4545465),
          contact: '9999999999',
          email: 'org-user@org.user',
          role: 'ORG',
          created_at: new Date(),
          password: 'password',
        }),
      ).rejects.toBeInstanceOf(ResourceNotFoundException)
    })
  })
})

describe('Create User Sessions scenarios', () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    sut = new UserService(userRepo)
  })

  it('Should be possible to create an session', async () => {
    const newUser = await sut.createUser({
      id: 'org-user',
      name: 'Org Test',
      country: 'test country',
      state: 'test state',
      city: 'test city',
      address: 'test-adress',
      zipcode: new Decimal(4545465),
      contact: '9999999999',
      email: 'org-user@org.user',
      role: 'ORG',
      created_at: new Date(),
      password: 'password',
    })

    const { id } = await sut.createSession({
      email: 'org-user@org.user',
      password: 'password',
    })
    expect(id).toEqual(newUser.id)
  })

  it('Should not be possible create an session with invalid credentials', async () => {
    const newUser = await sut.createUser({
      id: 'org-user',
      name: 'Org Test',
      country: 'test country',
      state: 'test state',
      city: 'test city',
      address: 'test-adress',
      zipcode: new Decimal(4545465),
      contact: '9999999999',
      email: 'org-user@org.user',
      role: 'ORG',
      created_at: new Date(),
      password: 'password',
    })
    await expect(
      sut.createSession({ email: newUser.email, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })

  it('Should not be possible create an session with non-existing credentials', async () => {
    await expect(
      sut.createSession({
        email: 'non-existing-user@email.com',
        password: 'non-existing-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })
})
