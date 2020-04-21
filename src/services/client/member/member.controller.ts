import { Controller, Get } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { ClientEnrollNewMember } from '../../../memberid/Core/Member/UseCase/client.enrollnewmember'

@Controller({ prefix: 'api/member' })
export class MemberController {
  @Get({ url: '/me' })
  async me (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	const usecase = new ClientEnrollNewMember()
  	const result = await usecase.execute()
    reply.sendOk(result)
  }
}
