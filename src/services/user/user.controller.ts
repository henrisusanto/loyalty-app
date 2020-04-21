import { Controller, Post, Get, InjectService } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { UserService } from './user.service'
import { TokenService } from '../token/token.service'

@Controller({ prefix: 'api/user' })
export class UserController {
  @InjectService(UserService)
  service: UserService

  @InjectService(TokenService)
  tokenService: TokenService

  @Post({ url: '/register' })
  async register (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const payload = request.body
      const result = await this.service.register(payload)
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Post({ url: '/login' })
  async login (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const payload = request.body
      const result = await this.service.login(payload)
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Get({ url: '/me' })
  async me (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const auth = request.headers.authorization as string
      const token = auth.split(' ')[1]
      const userTokenForLogin = await this.tokenService.getToken(token)
      if (!userTokenForLogin) throw new Error('Token not found')
      const result = await this.service.getUserById(userTokenForLogin?.userId)
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }
}
