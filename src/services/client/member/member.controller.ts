import { Controller, Post, Get } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { ClientEnrollNewMemberUseCase } from '../../../domain/LoyaltyCore/UseCase/Member/client.enrollnewmember.usecase'
import { ClientGetMemberListUseCase } from '../../../domain/LoyaltyCore/UseCase/Member/client.getmemberlist.usecase'
import { ClientGetMemberProfileUseCase } from '../../../domain/LoyaltyCore/UseCase/Member/client.getmemberprofile.usecase'
import { ClientUpdateMemberProfileUseCase } from '../../../domain/LoyaltyCore/UseCase/Member/client.updatememberprofile.usecase'
import { ClientEnableMemberUseCase } from '../../../domain/LoyaltyCore/UseCase/Member/client.enablemember.usecase'
import { ClientDisableMemberUseCase } from '../../../domain/LoyaltyCore/UseCase/Member/client.disablemember.usecase'
import { MemberRepository } from '../../../repositories/member.repository'

@Controller({ prefix: 'api/member' })
export class MemberController {

  @Post({ url: '/enroll' })
  async enroll (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
	  	const payload = JSON.parse(request.body)
	  	const memberRepo = new MemberRepository()
	  	const useCase = new ClientEnrollNewMemberUseCase (memberRepo)
	  	const Id = await useCase.execute(
	  		payload.name,
	  		payload.email,
	  		payload.phone,
	  		payload.register_date,
	  		payload.date_of_birth
	  	)
	    reply.sendOk({Id})
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Get({ url: '/list' })
  async memberList (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
	  	const payload = request.query
	  	const memberRepo = new MemberRepository()
	  	const useCase = new ClientGetMemberListUseCase (memberRepo)
	  	const result = await useCase.execute(
		    payload.record_per_page,
		    payload.current_page,
		    payload.q,
		    payload.sortBy,
		    payload.sort
	  	)
	    reply.sendOk(result)
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Get({ url: '/profile/:id' })
  async profile (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
		  const id:number = request.params.id
	  	const memberRepo = new MemberRepository()
	  	const useCase = new ClientGetMemberProfileUseCase (memberRepo)
	  	const result = await useCase.execute(id)
	    reply.sendOk(result)
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Post({ url: '/profile/:id' })
  async updateProfile (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
  		const id: number = parseInt (request.params.id)
	  	const payload = JSON.parse(request.body)
	  	const memberRepo = new MemberRepository()
	  	const useCase = new ClientUpdateMemberProfileUseCase (memberRepo)
	  	const Id = await useCase.execute(
	  		id,
	  		payload.name,
	  		payload.email,
	  		payload.phone,
	  		payload.register_date,
	  		payload.date_of_birth
	  	)
	    reply.sendOk({Id})
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Post({ url: ':id/enable' })
  async enable (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
		  const id:number = request.params.id
	  	const memberRepo = new MemberRepository ()
	  	const useCase = new ClientEnableMemberUseCase (memberRepo)
	  	const Id = await useCase.execute (id)
	    reply.sendOk({Id})
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Post({ url: ':id/disable' })
  async disable (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
		  const id:number = request.params.id
	  	const memberRepo = new MemberRepository ()
	  	const useCase = new ClientDisableMemberUseCase (memberRepo)
	  	const Id = await useCase.execute (id)
	    reply.sendOk({Id})
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

}
