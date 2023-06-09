import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'

describe('Create a Session controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be possible to create a session', async () => {
    await request(app.server).post('/users').send({
      name: 'New User',
      contact: '+78 54 1212321321',
      country: 'Teste',
      state: 'Test State',
      city: 'Test State',
      address: 'Rua do teste',
      zipcode: '7987987',
      email: 'new-session@member.com',
      password: 'password',
    })

    const response = await request(app.server).post('/users/login').send({
      email: 'new-session@member.com',
      password: 'password',
    })
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({ token: expect.any(String) })
  })
})
