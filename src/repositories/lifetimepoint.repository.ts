import { LifetimePointRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/lifetimepoint.repositoryinterface'
import { LifetimePointAggregateRoot } from '../domain/LoyaltyCore/AggregateRoot/lifetimepoint.aggregateroot'
import { LifetimePoint } from '../entities/lifeteimepoint.entity'
import { LifetimePointUsage } from '../entities/lifetimepointusage.entity'
const typeorm = require('typeorm')
const GT = typeorm.MoreThan
const IN = typeorm.In

interface LifetimeRecord {
  Id: number
  Activity: string
  Reference: number
  Member: number
  Amount: number
  Remaining: number
  DateIn: Date
  ExpiredDate: Date
  Remarks: string
}

interface UsageRecord {
  Id: number
  Activity: string
  Reference: number
  Member: number
  LifetimeId: number
  Amount: number
  Remarks: string
}

export class LifetimePointRepository implements LifetimePointRepositoryInterface {

  protected conn
  protected repo
  protected usageRepo

  constructor () {
      this.conn = typeorm.getConnection ()
      this.repo = this.conn.getRepository (LifetimePoint)
      this.usageRepo = this.conn.getRepository (LifetimePointUsage)
  }

  public async findAvailableByMember (Member: number): Promise <LifetimePointAggregateRoot []> {
    let points = await this.repo.find ({
      Remaining: GT(0),
      Member
    })

    let usages = await this.usageRepo.find ({
      LifetimeId: IN (points.map (point => {
        return point.Id
      }))
    })

    var domains: LifetimePointAggregateRoot [] = []
    for (let point of points) {
      domains.push (this.toDomain (point, usages.filter (usage => {
        return usage.LifetimeId === point.Id
      })))
    }
    return domains
  }

  public async  bulkSave (data: LifetimePointAggregateRoot []): Promise <number []> {
    let IDs: number [] = []
    for (let domain of data) {
      let { Point, Usages } = this.toPersistence (domain)
      let saved = await this.repo.save (Point)
      for (let usage of Usages) await this.usageRepo.save (usage)
      IDs.push (saved.Id)
    }
    return IDs
  }

  private toPersistence (data: LifetimePointAggregateRoot): {Point: LifetimeRecord, Usages: UsageRecord []} {
    let Point: LifetimeRecord
    let Usages: UsageRecord [] = []

    let json = data.toJSON ()
    Point = {
      Id: json.Id,
      Activity: json.Activity,
      Reference: json.Reference,
      Member: json.Member,
      Amount: json.Amount,
      Remaining: json.Remaining,
      DateIn: json.DateIn,
      ExpiredDate: json.ExpiredDate,
      Remarks: json.Remarks
    }

    for (let usage of json.Usage) {
      Usages.push({
        Id: usage.Id || 0,
        Activity: usage.Activity,
        Reference: usage.Reference,
        Member: usage.Member,
        LifetimeId: usage.LifetimeId,
        Amount: usage.Amount,
        Remarks: usage.Remarks
      })
    }

    return { Point, Usages }
  }

  private toDomain (point: LifetimeRecord, usages: UsageRecord []): LifetimePointAggregateRoot {
    let domain:LifetimePointAggregateRoot = new LifetimePointAggregateRoot ()
    let usageDomain = usages.map (usage => {
      return {
        Id: usage.Id,
        Member: usage.Member,
        Activity: usage.Activity,
        Reference: usage.Reference,
        LifetimeId: usage.LifetimeId,
        Amount: usage.Amount,
        Remarks: usage.Remarks        
      }
    })

    domain.fromJSON ({
      Id: point.Id,
      Member: point.Member,
      Activity: point.Activity,
      Reference: point.Reference,
      Amount: point.Amount,
      Remaining: point.Remaining,
      ExpiredDate: point.ExpiredDate,
      DateIn: point.DateIn,
      Remarks: point.Remarks,
      Usage: usageDomain
    })
    return domain
  }
}