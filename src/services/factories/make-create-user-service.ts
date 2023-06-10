import { PrismaUserRepository } from '../../repositories/prisa/prisma-user-repository'
import { CreateUserService } from '../create-user-service'

export function createUserService() {
  const repository = new PrismaUserRepository()
  return new CreateUserService(repository)
}
