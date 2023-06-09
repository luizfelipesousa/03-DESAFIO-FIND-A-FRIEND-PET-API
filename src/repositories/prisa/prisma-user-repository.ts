import { User } from '@prisma/client'
import { UserRepository } from '../user-repository'
import { prisma } from '../../lib/prisma'

export class PrismaUserRepository implements UserRepository {
  async createUser(user: User): Promise<User> {
    const createdUser = await prisma.user.create({
      data: { ...user },
    })
    return createdUser
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    return user
  }

  async findUsersByLocation(location: string): Promise<User[]> {
    const orgs = await prisma.user.findMany({
      where: {
        OR: [
          {
            country: {
              contains: location,
            },
          },
          {
            state: {
              contains: location,
            },
          },
          {
            city: {
              contains: location,
            },
          },
          {
            zipcode: {
              equals: location,
            },
          },
        ],
      },
    })
    return orgs
  }

  async findUserByIdAndRole(
    id: string,
    role: 'ORG' | 'MEMBER',
  ): Promise<User | null> {
    const org = await prisma.user.findFirst({
      where: {
        id,
        AND: {
          role,
        },
      },
    })

    return org
  }
}
