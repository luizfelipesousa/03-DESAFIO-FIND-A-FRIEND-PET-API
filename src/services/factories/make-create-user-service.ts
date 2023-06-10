import { PrismaUserRepository } from '../../repositories/prisa/prisma-user-repository'
import { CreateUserService } from '../create-user-service'

export function createUserService() {
  const repository = new PrismaUserRepository()
  const userService = new CreateUserService(repository)
  return userService
}
