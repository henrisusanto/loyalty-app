import { createServer, configuration } from 'fastro'
import './domain/LoyaltyCore/Event/core.event'

const start = async (): Promise<void> => {
  const conf = await configuration
  const { app: { port } } = conf
  /**
   * if you want to add server option, just pass options to createServer function.
   * for example:
   *
      createServer({
        logger: true
      })
  *
  * check this for another option https://www.fastify.io/docs/master/Server/
  **/
  const server = await createServer()
  server.listen(port, '0.0.0.0', (err) => {
    console.log(conf)
    if (err) {
      console.error('START_SERVER_ERROR', err)
      process.exit(1)
    }
  })
}

start()
