import { User } from '@prisma/client'
import { UserRepository } from '../user-repository'
import { randomUUID } from 'node:crypto'

const users: User[] = []

export class InMemoryUserRepository implements UserRepository {
  async createUser(user: User): Promise<User> {
    const id = randomUUID()
    const createdUser = users.push({ ...user, id })
    return users[createdUser]
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = users.find((u) => u.email === email)

    return user ?? null
  }

  async findUsersByLocation(location: string): Promise<User[]> {
    const orgs = users.filter(
      (u) =>
        u.country.includes(location) ||
        u.state.includes(location) ||
        u.city.includes(location) ||
        u.address.includes(location) ||
        location.includes(u.zipcode + ''),
    )
    return orgs
  }

  async findUserByIdAndRole(
    id: string,
    role: 'ORG' | 'MEMBER',
  ): Promise<User | null> {
    const user = users.find((u) => u.id === id && u.role === 'ORG')
    return user ?? null
  }
}
