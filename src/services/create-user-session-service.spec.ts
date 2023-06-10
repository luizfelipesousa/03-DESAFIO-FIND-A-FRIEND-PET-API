import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { InvalidCredentialsException } from './errors/invalid-credentials-exception'
import { CreateUserSessionService } from './create-user-session-service'
import { createUser } from '../utils/test/create-user-for-unit-test'

let userRepo: InMemoryUserRepository
let sut: CreateUserSessionService

describe('Create User Sessions scenarios', () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    sut = new CreateUserSessionService(userRepo)
  })

  it('Should be possible to create an session', async () => {
    const newUser = await createUser({
      repository: userRepo,
      role: 'ORG',
      email: 'org',
    })

    const { id } = await sut.execute({
      email: newUser.email,
      password: 'password',
    })

    expect(id).toEqual(newUser.id)
  })

  it('Should not be possible create an session with invalid credentials', async () => {
    const newUser = await createUser({
      repository: userRepo,
      role: 'ORG',
      email: 'org',
    })

    await expect(
      sut.execute({ email: newUser.email, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })

  it('Should not be possible create an session with non-existing credentials', async () => {
    await expect(
      sut.execute({
        email: 'non-existing-user@email.com',
        password: 'non-existing-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })
})
