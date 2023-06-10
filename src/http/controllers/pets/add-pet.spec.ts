import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { generateUser } from '../../../utils/test/create-user-for-e2e-test'
import { generateUserToken } from '../../../utils/test/get-toke-for-e2e-test'

describe('Add a pet controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be possible to a org add a pet for adoption', async () => {
    await generateUser(app.server, 'ORG')
    const { token } = await generateUserToken(app.server, 'ORG')

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `bearer ${token} `)
      .send({
        name: 'Bobby',
        species: 'dog',
        gender: 'female',
        color: 'white',
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({ petId: expect.any(String) })
  })
})
