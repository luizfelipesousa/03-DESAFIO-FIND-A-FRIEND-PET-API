import request from 'supertest'

export async function generateUserToken(
  server: any,
  role: 'MEMBER' | 'ORG',
  email?: string | 'new',
) {
  const response = await request(server)
    .post('/users/login')
    .send({
      email: `${email}@${role.toLowerCase()}.com`,
      password: 'password',
    })

  return response.body
}
