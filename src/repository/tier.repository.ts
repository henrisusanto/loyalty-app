'use strict'
import { Tier } from '../entity/tier.entity'
import { TierQualification } from '../entity/tierqualification.entity'
import { PKGen } from '../entity/pkgen.entity'
import { TierRepositoryInterface } from '../domain/Core/Tier/RepositoryInterface/tier.repositoryinterface'
import { TierAggregateRoot } from '../domain/Core/Tier/AggregateRoot/tier.aggregateroot'
import { QualificationEntity } from '../domain/Core/Tier/Entity/qualification.entity'
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

  public async save (tier: TierAggregateRoot): Promise <number> {
  	const saved = await this.repository.save (tier.toPersistence())
  	for (let qualification of tier.getQualifications ()) {
  		this.qualificationRepository.save (qualification.toPersistence ())
  	}
  	return saved.Id
  }

  public async findAll ():Promise <TierAggregateRoot[]> {
  	var tiers: TierAggregateRoot[] = []
  	const tierRecords = this.repository.find ()
  	const tierIds = tierRecords.map (t => {
  		return t.Id
  	})
  	const qualRecords = this.qualificationRepository.find({
  		Tier: typeorm.In(tierIds)
		})

  	for (let t of tierRecords) {
  		let tier = this.TierPersistenceToDomain(t)
  		const inclQ = qualRecords.filter (q => {
  			return q.Tier === t.Id
  		})
  		for (let iq of inclQ) {
  			let qualification = this.QualificationPersistenceToDomain (iq)
  			tier.pushQualification(qualification)
  		}
  		tiers.push(tier)
  	}
  	return tiers
  }

  protected TierPersistenceToDomain (data): TierAggregateRoot {
  	let tier = new TierAggregateRoot ()
  	tier.importFromPersistence (data.Id, data.Name, data.Year)
  	return tier
  }

  protected QualificationPersistenceToDomain (data): QualificationEntity {
  	let qualification = new QualificationEntity ()
  	qualification.importFromPersistence (data.Id, data.Tier, data.MemberField, data.ThresholdValue)
  	return qualification
  }

  protected TierDomainToPersistence (tier: TierAggregateRoot) {
  	const data = tier.toPersistence ()
		return {
			Id: data.Id,
			Name: data.Name,
			Year: data.Year
		}
  }

  protected QualificationDomainToPersistence (qualification: QualificationEntity) {
  	const data = qualification.toPersistence ()
  	return {
			Id: data.Id,
			Tier: data.Tier,
			MemberField: data.MemberField,
			ThresholdValue: data.ThresholdValue	
  	}
  }

}
