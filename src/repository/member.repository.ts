'use strict'
import { Member } from '../entity/member.entity'
import { MemberRepositoryInterface, MemberListParameter } from '../domain/Core/Member/RepositoryInterface/member.repositoryinterface'
import { MemberEntity, MemberJSON } from '../domain/Core/Member/Entity/member.entity'
const typeorm = require('typeorm')

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

    public async findOne (Id: number): Promise <MemberEntity> {
        const found = await this.repo.findOne(Id)
        if (!found) throw new Error ('Member not found')
        return this.toDomain(found)
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

    private toPersistence (domainEntity: MemberEntity) {
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
