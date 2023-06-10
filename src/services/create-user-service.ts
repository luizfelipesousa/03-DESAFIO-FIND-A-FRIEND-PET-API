import { Prisma } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import { UserRepository } from '../repositories/user-repository'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'

export class CreateUserService {
  constructor(private repository: UserRepository) {}

  async execute(user: Prisma.UserUncheckedCreateInput) {
    const userExists = await this.repository.findUserByEmail(user.email)

    if (userExists) {
      throw new ResourceNotFoundException()
    }

    const hashedPassword = await bcryptjs.hash(user.password, 6)

    user.password = hashedPassword

    const createdUser = await this.repository.createUser(user)

    return { ...createdUser, password: null }
  }
}
