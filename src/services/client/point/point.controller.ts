import { Controller, Post, Get } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'

import { ManualPointRepository } from '../../../repositories/manualpoint.repository'
import { PointRepository } from '../../../repositories/point.repository'
import { MemberRepository } from '../../../repositories/member.repository'
import { ConfigRepository } from '../../../repositories/config.repository'
import { PointTypeRepository } from '../../../repositories/pointtype.repository'

import { ClientSendPointUsecase } from '../../../domain/LoyaltyCore/UseCase/Point/client.sendpoint.usecase'
import { ClientUpdatePointNameUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.updatepointname.usecase'
import { ClientGetPointNameUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.getpointname.usecase'
import { ClientGetMemberPointHistory } from '../../../domain/LoyaltyCore/UseCase/Point/client.getmemberpointhistory.usecase'
import { ClientGetAccumulatedReport } from '../../../domain/LoyaltyCore/UseCase/Point/client.getaccumulatedreport.usecase'
import { ClientGetRedeemedReport } from '../../../domain/LoyaltyCore/UseCase/Point/client.getredeemedreport.usecase'
import { SchedulerExpirePoints } from '../../../domain/LoyaltyCore/UseCase/Point/scheduler.expirepoint.usecase'
import { ClientGetPointTypeUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.getpointtype.usecase'
import { ClientUpdatePointTypeUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.updatepointtype.usecase'

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

  @Get({ url: '/name' })
  async getPointName (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const configRepo = new ConfigRepository ()
      const useCase = new ClientGetPointNameUseCase (configRepo)
      const { Name, Abbr } = await useCase.execute ()
      reply.sendOk({ Name, Abbr })
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
      const PointTypeRepo = new PointTypeRepository ()
      const useCase = new ClientSendPointUsecase (
        ManualRepo,
        MemberRepo,
        PointRepo,
        PointTypeRepo
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
      const rateRepo = new PointTypeRepository ()
      const useCase = new ClientGetMemberPointHistory (repository, rateRepo)
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
      const rateRepo = new PointTypeRepository ()
      const memberRepo = new MemberRepository ()
      const useCase = new ClientGetAccumulatedReport (repository, rateRepo, memberRepo)
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
      const rateRepo = new PointTypeRepository ()
      const memberRepo = new MemberRepository ()
      const useCase = new ClientGetRedeemedReport (repository, rateRepo, memberRepo)
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
      const PointTypeRepo = new PointTypeRepository ()
      const useCase = new SchedulerExpirePoints (PointRepo, MemberRepo, PointTypeRepo)
      reply.sendOk (await useCase.execute (limit))
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Get({ url: '/rate' })
  async getRate (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const repository = new PointTypeRepository ()
      const useCase = new ClientGetPointTypeUseCase (repository)
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
      const repository = new PointTypeRepository ()
      const useCase = new ClientUpdatePointTypeUseCase (repository)
      const result = await useCase.execute(rates)
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }

}