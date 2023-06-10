import { PrismaUserRepository } from '../../repositories/prisa/prisma-user-repository'
import { CreateUserSessionService } from '../create-user-session-service'

export function createUserSessionService() {
  const repository = new PrismaUserRepository()
  const userService = new CreateUserSessionService(repository)
  return userService
}
