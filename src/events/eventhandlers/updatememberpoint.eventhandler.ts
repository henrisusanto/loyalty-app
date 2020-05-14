import { UpdateMemberPointEventHandlerInterface } from '../../domain/LoyaltyCore/Event/EventHandlerInterface/updatememberpoint.eventhandlerinterface'
// import { EventUpdateMemberPointUseCase } from '../../domain/LoyaltyCore/UseCase/Member/event.updatememberpoint.usecase'
import { MemberRepository } from '../../repositories/member.repository'

export class UpdateMemberPointEventHandler implements UpdateMemberPointEventHandlerInterface {

	public async callUseCase (pointHeader) {
		// let repo = new MemberRepository ()
		// let usecase = new EventUpdateMemberPointUseCase (repo)
		// await usecase.execute (pointHeader)
		// return { repo, usecase }
	}

}