'use strict'
import { PointHeader } from '../entities/pointheader.entity'
import { PointDetail } from '../entities/pointdetail.entity'
import { PKGen } from '../entities/pkgen.entity'
import { PointRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/point.repositoryinterface'
import { PointHeaderAggregateRoot, PointHeaderJSON } from '../domain/LoyaltyCore/AggregateRoot/pointheader.aggregateroot'
import { DomainEvent } from '../domain/LoyaltyCore/Event/domainevent.staticclass'
const typeorm = require('typeorm')

interface PointHeaderRecord {
  Id: number
  Member: number
  Amount: number
  Remarks: string
}

interface PointDetailRecord {
  PointHeader: number
  Amount: number
  Activity: string
  ExpiredDate: Date
}

export class PointRepository implements PointRepositoryInterface {

  protected connection
  protected repository
  protected detailRepository

  constructor() {
    this.connection = typeorm.getConnection ()
    this.repository = this.connection.getRepository (PointHeader)
    this.detailRepository = this.connection.getRepository (PointDetail)
  }

  public async generateId (): Promise <number> {
  	const generated = await this.connection.getRepository(PKGen).save({})
    return generated.id
  }

  public async insert (pointHeader: PointHeaderAggregateRoot): Promise <number> {
    const { pointHeaderRecord, pointDetailRecords } = this.toPersistence ( pointHeader )
    this.connection.transaction (async entityManager => {
      await entityManager.insert (PointHeader, pointHeaderRecord)
      await entityManager.insert (PointDetail, pointDetailRecords)
    })
    this.publishEventAfterInsertPoint (pointHeader)
  	return pointHeaderRecord.Id
  }

  public publishEventAfterInsertPoint (pointHeader: PointHeaderAggregateRoot) {
    DomainEvent.publish ('AfterInsertPoint', pointHeader)
  }

  protected toPersistence (pointHeader: PointHeaderAggregateRoot) {
    const data: PointHeaderJSON = pointHeader.toJSON ()
    let pointHeaderRecord: PointHeaderRecord = {
      Id: data.Id,
      Member: data.Member,
      Amount: data.Amount,
      Remarks: data.Remarks
    }

    let pointDetailRecords: PointDetailRecord[] = []
    for (let q of data.Details) {
      pointDetailRecords.push({
        PointHeader: pointHeaderRecord.Id,
        Amount: q.Amount,
        Activity: q.Activity,
        ExpiredDate: q.ExpiredDate
      })
    }

    return {pointHeaderRecord, pointDetailRecords}
  }

}
