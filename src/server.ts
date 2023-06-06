import { app } from './app'

app.listen({ host: '0.0.0.0', port: 3333 }).then((address: string) => {
  console.log(`Server is up and running at ${address} ! 🚀`)
})
