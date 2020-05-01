import { Controller, Post } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { ClientCreateDraftTier } from '../../../domain/Core/Tier/UseCase/client.createdrafttier.usecase'
import { SimpleTierJSON } from '../../../domain/Core/Tier/AggregateRoot/tier.aggregateroot'
import { SimpleQualificationJSON } from '../../../domain/Core/Tier/Entity/qualification.entity'
import { TierRepository } from '../../../repository/tier.repository'

@Controller({ prefix: 'api/tier' })
export class TierController {

  @Post({ url: '/create/:year' })
  async enroll (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
  		const Year = request.params.year
	  	const payload = JSON.parse (request.body)
	  	const tierRepo = new TierRepository ()
	  	const useCase = new ClientCreateDraftTier (tierRepo)

	  	var payloadToDomain: SimpleTierJSON[] = []
	  	for (let Name in payload) {
					let Qualifications: SimpleQualificationJSON[] = []
					for (let MemberField in payload[Name]) {
						Qualifications.push({
							MemberField,
							ThresholdValue: payload[Name][MemberField]
						})
					}
					payloadToDomain.push({
						Name,
						Qualifications
					})
	  	}

	  	const result = await useCase.execute (Year, payloadToDomain)
	    reply.sendOk({Year})
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

}