import { Controller, Post, Get } from 'fastro'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'

import { PointRepository } from '../../../repositories/point.repository'
import { MemberRepository } from '../../../repositories/member.repository'
import { PointTypeRepository } from '../../../repositories/pointtype.repository'
import { TransactionRepository } from '../../../repositories/transaction.repository'

import { ClientCancelTransactionUsecase } from '../../../domain/Transaction/Usecase/client.canceltransaction.usecase'
import { ClientGetMemberTransactionHistoryUsecase } from '../../../domain/Transaction/Usecase/client.getmembertransactionhistory.usecase'
import { ClientGetTransactionUsecase } from '../../../domain/Transaction/Usecase/client.gettransaction.usecase'
import { ClientGetTransactionReportUsecase } from '../../../domain/Transaction/Usecase/client.gettransactionreport.usecase'
import { ClientSubmitTransactionUsecase } from '../../../domain/Transaction/Usecase/client.submittransaction.usecase'
import { memo } from 'react'
import { Point } from '../../../entities/point.entity'


@Controller({ prefix: 'api/transaction' })
export class TransactionController {

  @Post({ url: '/submit' })
  async submit (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const { Member, TrxId, Spending } = JSON.parse(request.body)
      const TrxRepo = new TransactionRepository ()
      const PointRepo = new PointRepository ()
      const MemberRepo = new MemberRepository ()
      const PointTypeRepo = new PointTypeRepository ()
      const useCase = new ClientSubmitTransactionUsecase (MemberRepo, PointRepo, PointTypeRepo, TrxRepo)
      reply.sendOk (await useCase.execute (Member, TrxId, Spending))
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Post({ url: '/cancel/:Id' })
  async cancel (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
        const Id:number = request.params.Id
        const TrxRepo = new TransactionRepository ()
        const PointRepo = new PointRepository ()
        const MemberRepo = new MemberRepository ()
        const PointTypeRepo = new PointTypeRepository ()
        const useCase = new ClientCancelTransactionUsecase (MemberRepo, PointRepo, PointTypeRepo, TrxRepo)
        reply.sendOk (await useCase.execute (Id))
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Get({ url: '/:Id' })
  async transaction (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const Id:number = request.params.Id
      const TrxRepo = new TransactionRepository ()
      const MemberRepo = new MemberRepository ()
      const useCase = new ClientGetTransactionUsecase (TrxRepo, MemberRepo)
      const result = await useCase.execute(Id)
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Get({ url: '/history/:member' })
  async history (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const member:number = request.params.member
      const TrxRepo = new TransactionRepository ()
      const useCase = new ClientGetMemberTransactionHistoryUsecase (TrxRepo)
      const result = await useCase.execute(member)
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }

  @Get({ url: '/report' })
  async report (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    try {
      const { record_per_page, current_page, since, until } = request.query
      const TrxRepo = new TransactionRepository ()
      const PointRepo = new PointRepository ()
      const MemberRepo = new MemberRepository ()
      const PointTypeRepo = new PointTypeRepository ()
      const useCase = new ClientGetTransactionReportUsecase (MemberRepo, PointRepo, PointTypeRepo, TrxRepo)
      const result = await useCase.execute (record_per_page, current_page, since, until)
      reply.sendOk(result)
    } catch (error) {
      reply.sendError(error)
    }
  }
}