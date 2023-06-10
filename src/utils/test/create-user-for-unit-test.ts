import { Decimal } from '@prisma/client/runtime'
import { UserRepository } from '../../repositories/user-repository'

interface UserInfo {
  repository: UserRepository
  role: 'MEMBER' | 'ORG'
  email?: string
}
export async function createUser({ repository, role, email }: UserInfo) {
  const user = await repository.createUser({
    id: 'org-user',
    name: 'Org Test',
    country: 'test country',
    state: 'test state',
    city: 'test city',
    address: 'test-adress',
    zipcode: new Decimal(4545465),
    contact: '9999999999',
    email: `${email ?? 'email'}@${role.toLocaleLowerCase()}.pet`,
    role,
    created_at: new Date(),
    password: 'password',
  })

  return user
}
