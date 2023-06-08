import 'dotenv/config'
import { z } from 'zod'

const envPropSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'prod']),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envPropSchema.safeParse(envPropSchema)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables!')
}

export const env = _env.data
