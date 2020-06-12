'use strict'
import { Member } from '../entities/member.entity'
import { MemberRepositoryInterface, MemberListParameter } from '../domain/LoyaltyCore/RepositoryInterface/member.repositoryinterface'
import { MemberEntity, MemberJSON } from '../domain/LoyaltyCore/Entity/member.entity'
const typeorm = require('typeorm')
const In = typeorm.In

interface MemberRecord {
    Id: number
    FullName: string
    Email: string
    PhoneNumber: string
    Status: boolean
    RegisterDate: Date
    DateOfBirth: Date
    Tier: number
    LifetimePoint: number
    YTDPoint: number
    LifetimeVisit: number
    YTDVisit: number
    LifetimeSpending: number
    YTDSpending: number
}

export class MemberRepository implements MemberRepositoryInterface {

    protected conn
    protected repo

    constructor() {
        this.conn = typeorm.getConnection()
        this.repo = this.conn.getRepository(Member)
    }

    public async findAll (parameter: MemberListParameter): Promise <MemberEntity[]> {
        let order = {}
        order[parameter.orderBy] = parameter.order
        var where:{}[] = []
        for (let field of parameter.searchableFields) {
            let like = {}
            like[field] = typeorm.Like('%' + parameter.search + '%')
            where.push(like)
        }

        const results = await this.repo
        .find({
            where,
            take: parameter.limit,
            skip: parameter.offset,
            order
        })

        return results.map(result => {
          return this.toDomain(result)
        })
    }

    public async findForTierCalculation (parameters, limit: number): Promise <MemberEntity[]> {
        let tierSet: string[] = parameters.OR.map(tier => {
            var nestedWhere: string[] = []

            if (tier.OR.length > 0) {
                let aor: string[] = tier.OR.map (q => {
                    return `${q.Field} ${q.Operator} ${q.FieldValue}`
                })
                nestedWhere.push (`(${aor.join(' OR ')})`)
            }

            let aand: string[] = tier.AND.map (q => {
                if ('IN' === q.Operator) q.FieldValue = `(${q.FieldValue.join(',')})`
                return `${q.Field} ${q.Operator} ${q.FieldValue}`
            })
            nestedWhere.push (aand.join(' AND '))

            return `(${nestedWhere.join(' AND ')})`
        })
        let where: string = tierSet.join (' OR ')

        let members = await this.repo
          .createQueryBuilder('member')
          .select('*')
          .where (where)
          .limit(limit)
          .getRawMany()

        return members.map (member => {
            member.Status = 1 === member.Status
            return this.toDomain (member)
        })
    }

    public async findOne (Id: number): Promise <MemberEntity> {
        const found = await this.repo.findOne(Id)
        if (!found) throw new Error ('Member not found')
        return this.toDomain(found)
    }

    public async findByIDs (IDs: number []): Promise <MemberEntity []> {
        let found = await this.repo.find ({
            Id: In(IDs),
        })
        return found.map (member => {
            return this.toDomain (member)
        })
    }

    public async save (domainEntity: MemberEntity): Promise <number> {
		const dbEntity = this.toPersistence(domainEntity)
        try {
            const saved = await this.repo.save (dbEntity)
            return saved.Id
        } catch (e) {
            throw new Error (e)
        }
    }

    private toDomain (data): MemberEntity {
        const memberJSON: MemberJSON = {
            Id: data.Id,
            FullName: data.FullName,
            Email: data.Email,
            PhoneNumber: data.PhoneNumber,
            Status: data.Status,
            RegisterDate: data.RegisterDate,
            DateOfBirth: data.DateOfBirth,
            Tier: data.Tier,
            LifetimePoint: data.LifetimePoint,
            YTDPoint: data.YTDPoint,
            LifetimeVisit: data.LifetimeVisit,
            YTDVisit: data.YTDVisit,
            LifetimeSpending: data.LifetimeSpending,
            YTDSpending: data.YTDSpending  
        }

    	var memberDomainEntity = new MemberEntity()
        memberDomainEntity.fromJSON (memberJSON)
    	return memberDomainEntity
    }

    private toPersistence (domainEntity: MemberEntity): MemberRecord {
        const data: MemberJSON = domainEntity.toJSON ()
    	return {
            Id: data.Id,
            FullName: data.FullName,
            Email: data.Email,
            PhoneNumber: data.PhoneNumber,
            Status: data.Status,
            RegisterDate: data.RegisterDate,
            DateOfBirth: data.DateOfBirth,
            Tier: data.Tier,
            LifetimePoint: data.LifetimePoint,
            YTDPoint: data.YTDPoint,
            LifetimeVisit: data.LifetimeVisit,
            YTDVisit: data.YTDVisit,
            LifetimeSpending: data.LifetimeSpending,
            YTDSpending: data.YTDSpending
    	}
    }
}
