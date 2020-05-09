import { Controller, Post, Get } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { ClientSetDraftTier } from '../../../domain/LoyaltyCore/UseCase/Tier/client.setdrafttier.usecase'
import { ClientGetDraftTier } from '../../../domain/LoyaltyCore/UseCase/Tier/client.getdrafttier.usecase'
import { ClientGetActiveTierList } from '../../../domain/LoyaltyCore/UseCase/Tier/client.getactivetierlist.usecase'
import { ClientDeleteDraftTier } from '../../../domain/LoyaltyCore/UseCase/Tier/client.deletedrafttier.usecase'
import { SimpleTierJSON } from '../../../domain/LoyaltyCore/AggregateRoot/tier.aggregateroot'
import { SimpleQualificationJSON } from '../../../domain/LoyaltyCore/ValueObject/qualification.valueobject'
import { TierRepository } from '../../../repositories/tier.repository'

@Controller({ prefix: 'api/tier' })
export class TierController {

  @Post({ url: '/draft/:year' })
  async setDraft (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
  		const Year = request.params.year
	  	const payload = JSON.parse (request.body)
	  	const tierRepo = new TierRepository ()
	  	const useCase = new ClientSetDraftTier (tierRepo)

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

  @Get({ url: '/draft/:year' })
  async getDraft (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
  		const Year = request.params.year
	  	const tierRepo = new TierRepository ()
	  	const useCase = new ClientGetDraftTier (tierRepo)
	  	const result = await useCase.execute (Year)

	  	var formed = {}
	  	for ( let r of result ) {
	  		formed[r.Name] = {}
	  		for ( let q of r.Qualifications ) {
	  			formed[r.Name][q.MemberField] = q.ThresholdValue
	  		}
	  	}

	    reply.sendOk(formed)
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Get({ url: '/active' })
  async getActive (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
	  	const tierRepo = new TierRepository ()
	  	const useCase = new ClientGetActiveTierList (tierRepo)
	  	const result = await useCase.execute ()

	  	var formed = {}
	  	for ( let r of result ) {
	  		formed[r.Name] = {}
	  		for ( let q of r.Qualifications ) {
	  			formed[r.Name][q.MemberField] = q.ThresholdValue
	  		}
	  	}

	    reply.sendOk(formed)
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Post({ url: '/draft/:year/delete' })
  async deleteDraft (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
  		const Year = request.params.year
	  	const tierRepo = new TierRepository ()
	  	const useCase = new ClientDeleteDraftTier (tierRepo)
	  	const result = await useCase.execute (Year)
	    reply.sendOk({Year})
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Post({ url: '/name' })
  async updatePointName (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	reply.sendOk('kontol')
  }

}