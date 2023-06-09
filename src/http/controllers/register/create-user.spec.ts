import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'

describe('Create an User controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be possible to create an user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'New User',
      contact: '+78 54 1212321321',
      country: 'Teste',
      state: 'Test State',
      city: 'Test State',
      address: 'Rua do teste',
      zipcode: '798798978',
      email: 'new@member.com',
      password: 'password',
    })

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({ id: expect.any(String) })
  })
})
