'use strict'
import { Tier } from '../entity/tier.entity'
import { TierQualification } from '../entity/tierqualification.entity'
import { PKGen } from '../entity/pkgen.entity'
import { TierRepositoryInterface } from '../domain/Core/Tier/RepositoryInterface/tier.repositoryinterface'
import { TierAggregateRoot, TierJSON } from '../domain/Core/Tier/AggregateRoot/tier.aggregateroot'
const typeorm = require('typeorm')

interface TierRecord {
  Id: number
  Name: string
  Year: number
}

interface QualificationRecord {
  Tier: number
  MemberField: string
  ThresholdValue: number
}

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
    const { tierRecord, qualificationRecords } = this.toPersistence (tier)
    this.connection.transaction (async entityManager => {
      await entityManager.save (Tier, tierRecord)
      let oldQualifications = await entityManager.find (TierQualification, {Tier: tierRecord.Id})
      await entityManager.remove (TierQualification, oldQualifications)
      await entityManager.save (TierQualification, qualificationRecords)
    })
  	return tierRecord.Id
  }

  protected toPersistence (tier: TierAggregateRoot) {
    const data: TierJSON = tier.toJSON ()
    let tierRecord: TierRecord = {
      Id: data.Id,
      Name: data.Name,
      Year: data.Year
    }
    let qualificationRecords: QualificationRecord[] = []
    for (let q of data.Qualifications) {
      qualificationRecords.push({
        Tier: tierRecord.Id,
        MemberField: q.MemberField,
        ThresholdValue: q.ThresholdValue
      })
    }

    return {tierRecord, qualificationRecords}
  }

}
