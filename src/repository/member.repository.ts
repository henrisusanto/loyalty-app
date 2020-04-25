'use strict'
import { Member } from '../entity/member.entity'
import { PKGen } from '../entity/pkgen.entity'
import { MemberRepositoryInterface } from '../domain/Core/Member/RepositoryInterface/member.repository.interface'
import { MemberEntity } from '../domain/Core/Member/Entity/member.entity'
const typeorm = require('typeorm')

export class MemberRepository implements MemberRepositoryInterface {

    protected conn
    protected repo

    constructor() {
        this.conn = typeorm.getConnection()
        this.repo = this.conn.getRepository(Member)
    }

    public async findAll (parameter): Promise <MemberEntity[]> {
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
          return this.persistenceToDomain(result)
        })
    }

    public async findOne (id: number): Promise <MemberEntity> {
        const found = await this.repo.findOne(id)
        if (!found) throw new Error ('Member not found')
        return this.persistenceToDomain(found)
    }

    public async generateId (): Promise <number> {
    	const generated = await this.conn.getRepository(PKGen).save({})
    	this.conn.getRepository(PKGen).delete(generated.id)
        return generated.id
    }

    public async save (domainEntity: MemberEntity): Promise <void> {
		const dbEntity = this.domainToPersistence(domainEntity)
        try {
            return this.repo.save(dbEntity)
        } catch (e) {
            throw new Error (e)
        }
    }

    private persistenceToDomain (data): MemberEntity {
    	var memberDomainEntity = new MemberEntity()
        memberDomainEntity.importFromPersistence(data)
    	return memberDomainEntity
    }

    private domainToPersistence (domainEntity: MemberEntity) {
        const JSONObj = domainEntity.exportToPersistence()
    	return {
            id: JSONObj.id,
            FullName: JSONObj.FullName,
            Email: JSONObj.Email,
            PhoneNumber: JSONObj.PhoneNumber,
            Status: JSONObj.Status,
            RegisterDate: JSONObj.RegisterDate,
            DateOfBirth: JSONObj.DateOfBirth,
            Tier: JSONObj.Tier,
            LifetimePoint: JSONObj.LifetimePoint,
            YTDPoint: JSONObj.YTDPoint
    	}
    }
}
