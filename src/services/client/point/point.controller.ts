import { Controller, Post } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { ClientUpdatePointNameUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.updatepointname.usecase'
import { ConfigRepository } from '../../../repositories/config.repository'
import { ClientAddMemberPointUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.addmemberpoint.usecase'
import { ManualPointRepository } from '../../../repositories/manualpoint.repository'

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
      const { Member, ManualDate, YTD, Lifetime, Remarks } = JSON.parse(request.body)
      const manualPointRepo = new ManualPointRepository ()
      const useCase = new ClientAddMemberPointUseCase (manualPointRepo)
      const result = await useCase.execute (Member, ManualDate, YTD, Lifetime, Remarks)
      reply.sendOk (result)
    } catch (error) {
      reply.sendError(error)
    }
  }

}