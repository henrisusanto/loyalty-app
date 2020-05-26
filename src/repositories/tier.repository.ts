'use strict'
import { Tier } from '../entities/tier.entity'
import { TierQualification } from '../entities/tierqualification.entity'
import { PKGen } from '../entities/pkgen.entity'
import { TierRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/tier.repositoryinterface'
import { TierAggregateRoot, TierJSON } from '../domain/LoyaltyCore/AggregateRoot/tier.aggregateroot'
const typeorm = require('typeorm')

interface TierRecord {
  Id: number
  Name: string
  Year: number
  Level: number
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

  public async findByYear (year: number): Promise <TierAggregateRoot[]> {
    const { tiers, qualifications } = await this.findRecordsByYear (year)
    let Tiers: TierAggregateRoot[] = []
    for ( let tier of tiers ) {
      let tierQualifications = qualifications.filter (q => {
        return q.Tier === tier.Id
      })
      let Tier = this.toDomain (tier, tierQualifications)
      Tiers.push(Tier)
    }
    return Tiers
  }

  public async deleteByYear (year: number): Promise <void> {
    const { tiers, qualifications } = await this.findRecordsByYear (year)
    await this.repository.remove (tiers)
    return await this.qualificationRepository.remove (qualifications)
  }

  public async deleteQualifications (TierId: number): Promise <void> {
    let oldQualifications = await this.qualificationRepository.find ({where: {Tier: TierId}})
    return await this.qualificationRepository.remove (oldQualifications)
  }

  public async save (tier: TierAggregateRoot): Promise <number> {
    const { tierRecord, qualificationRecords } = this.toPersistence (tier)
    this.connection.transaction (async entityManager => {
      await this.deleteByYear (tierRecord.Year)
      await entityManager.save (Tier, tierRecord)
      await this.deleteQualifications (tierRecord.Id)
      await entityManager.save (TierQualification, qualificationRecords)
    })
  	return tierRecord.Id
  }

  protected async findRecordsByYear (year: number) {
    let tiers: TierRecord[] = await this.repository.find({where: {Year: year}})
    let tierIds: number[] = tiers.map(t => {
      return t.Id
    })
    let qualifications = tierIds.length > 0 ? await this.qualificationRepository.find ({Tier: typeorm.In (tierIds)}) : []
    return {tiers, qualifications}
  }

  protected toPersistence (tier: TierAggregateRoot) {
    const data: TierJSON = tier.toJSON ()
    let tierRecord: TierRecord = {
      Id: data.Id,
      Name: data.Name,
      Year: data.Year,
      Level: data.Level
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

  protected toDomain (tier: TierRecord, qualifications: QualificationRecord[]): TierAggregateRoot {
    let tierAggregateRoot: TierAggregateRoot = new TierAggregateRoot ()
    let qualificationJSON = qualifications.map (q => {
      return {
        Tier: q.Tier,
        MemberField: q.MemberField,
        ThresholdValue: q.ThresholdValue
      }
    })
    let tierJSON: TierJSON = {
      Id: tier.Id,
      Name: tier.Name,
      Year: tier.Year,
      Level: tier.Level,
      Qualifications: qualificationJSON
    }
    tierAggregateRoot.fromJSON (tierJSON)
    return tierAggregateRoot
  }

}
