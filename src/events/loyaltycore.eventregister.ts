import { LoyaltyCoreEventRegister } from '../domain/LoyaltyCore/Event/loyaltycore.eventregister'
import { UpdateMemberPointEventHandler } from './eventhandlers/updatememberpoint.eventhandler'

let updateMemberPointEventHandler = new UpdateMemberPointEventHandler ()

let loyaltyCoreEventRegister = new LoyaltyCoreEventRegister (updateMemberPointEventHandler)
loyaltyCoreEventRegister.register ()