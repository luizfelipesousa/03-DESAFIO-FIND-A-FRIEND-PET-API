import bcryptjs from 'bcryptjs'
import { UserRepository } from '../repositories/user-repository'
import { InvalidCredentialsException } from './errors/invalid-credentials-exception'

interface Credentials {
  email: string
  password: string
}

export class CreateUserSessionService {
  constructor(private repository: UserRepository) {}

  async execute(credentials: Credentials) {
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
