export class AccessNotGrantedException extends Error {
  constructor() {
    super('You are not granted for this operation.')
  }
}
