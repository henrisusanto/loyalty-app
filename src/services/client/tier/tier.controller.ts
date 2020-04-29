import { Controller, Post } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { ClientCreateDraftTier } from '../../../domain/Core/Tier/UseCase/client.createdrafttier.usecase'
import { SimpleTier } from '../../../domain/Core/Tier/AggregateRoot/tier.aggregateroot'
import { SimpleQualification } from '../../../domain/Core/Tier/Entity/qualification.entity'
import { TierRepository } from '../../../repository/tier.repository'

@Controller({ prefix: 'api/tier' })
export class TierController {

  @Post({ url: '/create/:year' })
  async enroll (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
  		const year = request.params.year
	  	const payload = JSON.parse (request.body)
	  	const tierRepo = new TierRepository ()
	  	const useCase = new ClientCreateDraftTier (tierRepo)

	  	var payloadToDomain: SimpleTier[] = []
	  	for (let Name in payload) {
					let Qualifications: SimpleQualification[] = []
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

	  	const result = await useCase.execute (year, payloadToDomain)
	    reply.sendOk(result)
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

}