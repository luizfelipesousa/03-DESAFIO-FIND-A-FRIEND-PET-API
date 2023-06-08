import { Prisma, User } from '@prisma/client'

export interface UserRepository {
  createUser(user: Prisma.UserUncheckedCreateInput): Promise<User>
  findUserByEmail(email: string): Promise<User | null>
  findUsersByLocation(location: string): Promise<User[]>
  findUserByIdAndRole(id: string, role: 'ORG' | 'MEMBER'): Promise<User | null>
}
