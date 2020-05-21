import { Controller, Post, Get } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'

import { ManualPointRepository } from '../../../repositories/manualpoint.repository'
import { PointRepository } from '../../../repositories/point.repository'
import { MemberRepository } from '../../../repositories/member.repository'
import { ConfigRepository } from '../../../repositories/config.repository'

import { ClientUpdatePointNameUseCase } from '../../../domain/LoyaltyCore/UseCase/Point/client.updatepointname.usecase'
import { ClientAddMemberPointUsecase } from '../../../domain/LoyaltyCore/UseCase/Point/client.addmemberpoint.usecase'
import { ClientDeductMemberPointUsecase } from '../../../domain/LoyaltyCore/UseCase/Point/client.deductmemberpoint'
import { ClientGetMemberPointHistory } from '../../../domain/LoyaltyCore/UseCase/Point/client.getmemberpointhistory.usecase'

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
      const { Member, LifetimeDateIn, YTD, Lifetime, Remarks } = JSON.parse(request.body)
      const ManualRepo = new ManualPointRepository ()
      const PointRepo = new PointRepository ()
      const MemberRepo = new MemberRepository ()
      const useCase = new ClientAddMemberPointUsecase (ManualRepo, PointRepo, MemberRepo)
      reply.sendOk (await useCase.execute (Member, YTD, Lifetime, LifetimeDateIn, Remarks))
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Post({ url: '/deduct' })
  async deduct (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const { Member, YTD, Lifetime, Remarks } = JSON.parse(request.body)
      const ManualRepo = new ManualPointRepository ()
      const PointRepo = new PointRepository ()
      const MemberRepo = new MemberRepository ()
      const useCase = new ClientDeductMemberPointUsecase (ManualRepo, PointRepo, MemberRepo)
      reply.sendOk (await useCase.execute (Member, YTD, Lifetime, Remarks))
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
}