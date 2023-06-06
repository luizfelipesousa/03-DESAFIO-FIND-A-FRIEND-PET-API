import { fastify } from 'fastify'
import { helloRoute } from './http/routes/hello'

export const app = fastify()

app.register(helloRoute)
