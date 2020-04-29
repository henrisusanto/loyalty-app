'use strict'
import { Tier } from '../entity/tier.entity'
import { TierQualification } from '../entity/tierqualification.entity'
import { PKGen } from '../entity/pkgen.entity'
import { TierRepositoryInterface } from '../domain/Core/Tier/RepositoryInterface/tier.repositoryinterface'
import { TierAggregateRoot } from '../domain/Core/Tier/AggregateRoot/tier.aggregateroot'
const typeorm = require('typeorm')

export class TierRepository implements TierRepositoryInterface {

  protected connection
  protected repository
  protected qualificationRepository

  constructor() {
    this.connection = typeorm.getConnection ()
    this.repository = this.connection.getRepository (Tier)
    this.qualificationRepository = this.connection.getRepository (TierQualification)
  }

  public async generateId (): Promise <number> {
  	const generated = await this.connection.getRepository(PKGen).save({})
    return generated.id
  }

  public async save (tier: TierAggregateRoot): Promise <TierAggregateRoot> {
  	this.repository.save (tier.toPersistence())
  	for (let qualification of tier.getQualifications ()) {
  		this.qualificationRepository.save (qualification.toPersistence ())
  	}
  	return tier
  }

}
