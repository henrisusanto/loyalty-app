import { Controller, Post } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { ClientUpdatePointNameUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.updatepointname.usecase'
import { ClientAddMemberPointUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.addmemberpoint.usecase'
import { ClientDeductMemberPointUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.deductmemberpoint.usecase'
import { ConfigRepository } from '../../../repositories/config.repository'
import { PointRepository } from '../../../repositories/point.repository'

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

  @Post({ url: '/add' })
  async add (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const { Member, YTDPoint, LifetimePoint, Remarks } = JSON.parse(request.body)
      let repo = new PointRepository ()
      let useCase = new ClientAddMemberPointUseCase (repo)
      let Id = await useCase.execute ( Member, YTDPoint, LifetimePoint, Remarks )
      reply.sendOk({ Id })
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Post({ url: '/deduct' })
  async deduct (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const { Member, YTDPoint, LifetimePoint, Remarks } = JSON.parse(request.body)
      let repo = new PointRepository ()
      let useCase = new ClientDeductMemberPointUseCase (repo)
      let Id = await useCase.execute ( Member, YTDPoint, LifetimePoint, Remarks )
      reply.sendOk({ Id })
    } catch (error) {
      reply.sendError(error)
    }
  }

}