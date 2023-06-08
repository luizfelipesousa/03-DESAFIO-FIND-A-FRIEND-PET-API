export class InvalidCredentialsException extends Error {
  constructor() {
    super('Credentials are invalid.')
  }
}
