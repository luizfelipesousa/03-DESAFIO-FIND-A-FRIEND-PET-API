import { User } from '@prisma/client'
import { UserRepository } from '../user-repository'
import { randomUUID } from 'node:crypto'
import bcryptjs from 'bcryptjs'

export class InMemoryUserRepository implements UserRepository {
  users: User[] = []
  async createUser(user: User): Promise<User> {
    const id = randomUUID()
    const password = await bcryptjs.hash(user.password, 6)
    this.users.push({ ...user, id, password })
    return { ...user, id }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email)

    return user ?? null
  }

  async findUsersByLocation(location: string): Promise<User[]> {
    const orgs = this.users.filter(
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
    const user = this.users.find((u) => u.id === id && u.role === role)
    return user ?? null
  }
}
