import { Controller, Post, Get } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { ClientEnrollNewMember } from '../../../domain/Core/Member/UseCase/client.enrollnewmember.usecase'
import { ClientGetMemberList } from '../../../domain/Core/Member/UseCase/client.getmemberlist.usecase'
import { ClientGetMemberProfile } from '../../../domain/Core/Member/UseCase/client.getmemberprofile.usecase'
import { ClientUpdateMemberProfile } from '../../../domain/Core/Member/UseCase/client.updatememberprofile.usecase'
import { MemberRepository } from '../../../repository/member.repository'

@Controller({ prefix: 'api/member' })
export class MemberController {

  @Post({ url: '/enroll' })
  async enroll (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
	  	const payload = JSON.parse(request.body)
	  	const memberRepo = new MemberRepository()
	  	const useCase = new ClientEnrollNewMember(memberRepo)
	  	const result = await useCase.execute(
	  		payload.name,
	  		payload.email,
	  		payload.phone,
	  		payload.register_date,
	  		payload.date_of_birth
	  	)
	    reply.sendOk(result)
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Get({ url: '/list' })
  async memberList (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
	  	const payload = request.query
	  	const memberRepo = new MemberRepository()
	  	const useCase = new ClientGetMemberList(memberRepo)
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
	  	const useCase = new ClientGetMemberProfile(memberRepo)
	  	const result = await useCase.execute(id)
	    reply.sendOk(result)
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

  @Post({ url: '/profile/:id' })
  async updateProfile (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
  	try {
	  	const payload = JSON.parse(request.body)
	  	const memberRepo = new MemberRepository()
	  	const useCase = new ClientUpdateMemberProfile(memberRepo)
	  	const result = await useCase.execute(
	  		parseInt (request.params.id),
	  		payload.name,
	  		payload.email,
	  		payload.phone,
	  		payload.register_date,
	  		payload.date_of_birth
	  	)
	    reply.sendOk(result)
  	} catch (error) {
  		reply.sendError(error)
  	}
  }

}
