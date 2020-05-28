import { Controller, Post, Get } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'

import { ClientSetDraftTierUseCase } from '../../../domain/LoyaltyCore/UseCase/Tier/client.setdrafttier.usecase'
import { ClientGetDraftTierUseCase } from '../../../domain/LoyaltyCore/UseCase/Tier/client.getdrafttier.usecase'
import { ClientGetActiveTierListUseCase } from '../../../domain/LoyaltyCore/UseCase/Tier/client.getactivetierlist.usecase'
import { ClientDeleteDraftTierUseCase } from '../../../domain/LoyaltyCore/UseCase/Tier/client.deletedrafttier.usecase'
import { SchedulerUpgradeTierUsecase } from '../../../domain/LoyaltyCore/UseCase/Tier/scheduler.upgradetier.usecase'

import { SimpleTierJSON } from '../../../domain/LoyaltyCore/AggregateRoot/tier.aggregateroot'
import { SimpleQualificationJSON } from '../../../domain/LoyaltyCore/ValueObject/qualification.valueobject'

import { TierRepository } from '../../../repositories/tier.repository'
import { MemberRepository } from '../../../repositories/member.repository'
import { TierHistoryRepository } from '../../../repositories/tierhistory.repository'

@Controller({ prefix: 'api/tier' })
export class TierController {

  @Post({ url: '/draft/:year' })
  async setDraft (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
  		const Year = request.params.year
	  	const payload = JSON.parse (request.body)
	  	const tierRepo = new TierRepository ()
	  	const useCase = new ClientSetDraftTierUseCase (tierRepo)

	  	var payloadToDomain: SimpleTierJSON[] = []
	  	payload.forEach (tier => {
					let Qualifications: SimpleQualificationJSON[] = []
					for (let MemberField in tier.Qualifications) {
						Qualifications.push({
							MemberField,
							ThresholdValue: tier.Qualifications[MemberField]
						})
					}
					payloadToDomain.push({
						Name: tier.Name,
						Level: tier.Level,
						Qualifications
					})
	  	})

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
	  	const useCase = new ClientGetDraftTierUseCase (tierRepo)
	  	const result = await useCase.execute (Year)

	  	let formed = result.map(r => {
	  		let qualifications = {}
	  		r.Qualifications.forEach (q => {
	  			qualifications[q.MemberField] = q.ThresholdValue
	  		})
	  		return {
	  			Name: r.Name,
	  			Level: r.Level,
	  			Qualifications: qualifications
	  		}
	  	})

	    reply.sendOk(formed)
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Get({ url: '/active' })
  async getActive (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
	  	const tierRepo = new TierRepository ()
	  	const useCase = new ClientGetActiveTierListUseCase (tierRepo)
	  	const result = await useCase.execute ()

	  	let formed = result.map(r => {
	  		let qualifications = {}
	  		r.Qualifications.forEach (q => {
	  			qualifications[q.MemberField] = q.ThresholdValue
	  		})
	  		return {
	  			Name: r.Name,
	  			Level: r.Level,
	  			Qualifications: qualifications
	  		}
	  	})

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
	  	const useCase = new ClientDeleteDraftTierUseCase (tierRepo)
	  	const result = await useCase.execute (Year)
	    reply.sendOk({Year})
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Post({ url: '/upgrade' })
  async upgrade (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
	  	const tierRepo = new TierRepository ()
	  	const memberRepo = new MemberRepository ()
	  	const historyRepo = new TierHistoryRepository ()
	  	const useCase = new SchedulerUpgradeTierUsecase (tierRepo, memberRepo, historyRepo)
	  	const result = await useCase.execute (100)
	    reply.sendOk(result)
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

}