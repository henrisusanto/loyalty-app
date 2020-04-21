import { FastifyInstance } from 'fastify'
import ejs from 'ejs'
import pov from 'point-of-view'

export const plugin = function (fastify: FastifyInstance, opts: never, next: Function): void {
  fastify.register(pov, { engine: { ejs } })
  next()
}
