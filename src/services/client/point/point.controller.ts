import { Controller, Post, Get } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'

import { ManualPointRepository } from '../../../repositories/manualpoint.repository'
import { PointRepository } from '../../../repositories/point.repository'
import { MemberRepository } from '../../../repositories/member.repository'
import { ConfigRepository } from '../../../repositories/config.repository'
import { ActivityRateRepository } from '../../../repositories/activityrate.repository'

import { ClientSendPointUsecase } from '../../../domain/LoyaltyCore/UseCase/Point/client.sendpoint.usecase'
import { ClientUpdatePointNameUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.updatepointname.usecase'
import { ClientGetMemberPointHistory } from '../../../domain/LoyaltyCore/UseCase/Point/client.getmemberpointhistory.usecase'
import { ClientGetAccumulatedReport } from '../../../domain/LoyaltyCore/UseCase/Point/client.getaccumulatedreport.usecase'
import { ClientGetRedeemedReport } from '../../../domain/LoyaltyCore/UseCase/Point/client.getredeemedreport.usecase'
import { SchedulerExpirePoints } from '../../../domain/LoyaltyCore/UseCase/Point/scheduler.expirepoint.usecase'
import { ClientGetActivityRateUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.getactivityrate.usecase'
import { ClientUpdateActivityRateUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.updateactivityrate.usecase'

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
  async sendPoint (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const { Member, LifetimeDateIn, YTD, Lifetime, Remarks } = JSON.parse(request.body)
      const ManualRepo = new ManualPointRepository ()
      const PointRepo = new PointRepository ()
      const MemberRepo = new MemberRepository ()
      const RateRepo = new ActivityRateRepository ()
      const useCase = new ClientSendPointUsecase (
        ManualRepo,
        MemberRepo,
        PointRepo,
        RateRepo
      )
      reply.sendOk (await useCase.execute (Member, YTD, Lifetime, LifetimeDateIn, Remarks))
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Get({ url: '/history/:member' })
  async history (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const member:number = request.params.member
      const repository = new PointRepository ()
      const useCase = new ClientGetMemberPointHistory (repository)
      const result = await useCase.execute(member)
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Get({ url: '/report/accumulated' })
  async pointAccumulatedReport (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const { record_per_page, current_page, since, until } = request.query
      const repository = new PointRepository ()
      const useCase = new ClientGetAccumulatedReport (repository)
      const result = await useCase.execute( record_per_page, current_page, since, until )
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Get({ url: '/report/redeemed' })
  async pointRedeemedReport (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const { record_per_page, current_page, since, until } = request.query
      const repository = new PointRepository ()
      const useCase = new ClientGetRedeemedReport (repository)
      const result = await useCase.execute( record_per_page, current_page, since, until )
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Post({ url: '/expire/:limit' })
  async expire (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const limit = request.params.limit
      const PointRepo = new PointRepository ()
      const MemberRepo = new MemberRepository ()
      const RateRepo = new ActivityRateRepository ()
      const useCase = new SchedulerExpirePoints (PointRepo, MemberRepo, RateRepo)
      reply.sendOk (await useCase.execute (limit))
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Get({ url: '/rate' })
  async getRate (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const repository = new ActivityRateRepository ()
      const useCase = new ClientGetActivityRateUseCase (repository)
      const result = await useCase.execute()
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Post({ url: '/rate' })
  async setRate (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const rates = JSON.parse (request.body)
      const repository = new ActivityRateRepository ()
      const useCase = new ClientUpdateActivityRateUseCase (repository)
      const result = await useCase.execute(rates)
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }

}