import { PrismaUserRepository } from '../../repositories/prisa/prisma-user-repository'
import { UserService } from '../user-service'

export function createUserServiceFactory() {
  const repository = new PrismaUserRepository()
  const userService = new UserService(repository)
  return userService
}
