import { Controller, Post } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { ClientUpdatePointName } from '../../../domain/Core/Point/UseCase/client.updatepointname.usecase'
import { ConfigRepository } from '../../../repository/config.repository'

@Controller({ prefix: 'api/point' })
export class PointController {

  @Post({ url: '/name' })
  async updatePointName (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
  		const { Name, Abbr } = JSON.parse(request.body)
	  	const configRepo = new ConfigRepository ()
	  	const useCase = new ClientUpdatePointName (configRepo)
	  	const result = await useCase.execute (Name, Abbr)
	    reply.sendOk({Name, Abbr})
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

}