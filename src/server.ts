import { app } from './app'
import { env } from './env'

app.listen({ host: '0.0.0.0', port: env.PORT }).then((address: string) => {
  console.log(`Server is up and running at ${address} ! 🚀`)
})
