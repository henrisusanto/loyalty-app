import { FastifyInstance } from 'fastify'
import fastifyStatic from 'fastify-static'
import { join } from 'path'

export const plugin = function (fastify: FastifyInstance, opts: never, next: Function): void {
  fastify.register(fastifyStatic, {
    root: join(__dirname, '../../public'),
    prefix: '/public/'
  })
  next()
}
