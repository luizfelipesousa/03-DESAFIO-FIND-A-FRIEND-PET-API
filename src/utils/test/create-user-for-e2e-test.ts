import request from 'supertest'

export async function generateUser(
  server: any,
  role: 'MEMBER' | 'ORG',
  email?: string | 'new',
) {
  const response = await request(server)
    .post('/users')
    .send({
      name: 'New User',
      contact: '+78 54 1212321321',
      country: 'Teste',
      state: 'Test State',
      city: 'Test State',
      address: 'Rua do teste',
      zipcode: '7987987',
      email: `${email}@${role.toLowerCase()}.com`,
      password: 'password',
      role: role ?? 'MEMBER',
    })

  return response.body
}
