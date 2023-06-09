import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'
import {
  generateUser,
  generateUserToken,
} from '../../../utils/test/create-user'

describe('Search pet controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be possible to a org add a pet for adoption', async () => {
    await generateUser(app.server, 'ORG', 'adopt')
    const { token } = await generateUserToken(app.server, 'ORG', 'adopt')

    await request(app.server)
      .post('/pets')
      .set('Authorization', `bearer ${token} `)
      .send({
        name: 'Dranzer',
        species: 'bird',
        gender: 'male',
        color: 'red',
      })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `bearer ${token} `)
      .send({
        name: 'Black Dranzer',
        species: 'bird',
        gender: 'male',
        color: 'black',
      })

    const response = await request(app.server)
      .get('/pets?location=Teste&color=black')
      .send()

    const { pets } = response.body

    expect(response.statusCode).toEqual(200)
    expect(pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Black Dranzer',
        }),
      ]),
    )
  })
})
