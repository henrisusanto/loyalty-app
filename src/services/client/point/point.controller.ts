import { Controller, Post } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { ClientUpdatePointNameUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.updatepointname.usecase'
import { ConfigRepository } from '../../../repositories/config.repository'
import { ClientSendPointUsecase } from '../../../domain/LoyaltyCore/UseCase/Point/client.sendpoint.usecase'

import { ManualPointRepository } from '../../../repositories/manualpoint.repository'
import { MemberPointRepository } from '../../../repositories/memberpoint.repository'

@Controller({ prefix: 'api/point' })
export class PointController {

  @Post({ url: '/name' })
  async updatePointName (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
  		const { Name, Abbr } = JSON.parse(request.body)
	  	const configRepo = new ConfigRepository ()
	  	const useCase = new ClientUpdatePointNameUseCase (configRepo)
	  	const result = await useCase.execute (Name, Abbr)
	    reply.sendOk({Name, Abbr})
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Post({ url: '/send' })
  async send (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const { Member, LifetimeDateIn, YTD, Lifetime, Remarks } = JSON.parse(request.body)

      const manualPointRepo = new ManualPointRepository ()
      const memberPointRepo = new MemberPointRepository ()

      const useCase = new ClientSendPointUsecase (manualPointRepo, memberPointRepo)
      reply.sendOk (await useCase.execute (Member, YTD, Lifetime, LifetimeDateIn, Remarks))
    } catch (error) {
      reply.sendError(error)
    }
  }

}