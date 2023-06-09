import { Prisma } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import { UserRepository } from '../repositories/user-repository'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'
import { InvalidCredentialsException } from './errors/invalid-credentials-exception'

export class UserService {
  constructor(private repository: UserRepository) {}

  async createUser(user: Prisma.UserUncheckedCreateInput) {
    const userExists = await this.repository.findUserByEmail(user.email)

    if (userExists) {
      throw new ResourceNotFoundException()
    }

    const hashedPassword = await bcryptjs.hash(user.password, 6)

    user.password = hashedPassword

    const createdUser = await this.repository.createUser(user)

    return { ...createdUser, password: null }
  }

  async createSession(credentials: any) {
    const user = await this.repository.findUserByEmail(credentials.email)

    if (!user) {
      throw new InvalidCredentialsException()
    }

    const passwordIsValid = await bcryptjs.compare(
      credentials.password,
      user.password,
    )

    if (!passwordIsValid) {
      throw new InvalidCredentialsException()
    }

    return user
  }
}
