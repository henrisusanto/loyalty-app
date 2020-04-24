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

    public async generateId (): number {
    	const generated = await this.conn.getRepository(PKGen).save({})
    	this.conn.getRepository(PKGen).delete(generated.id)
    	return generated.id
    }

    public async save (domainEntity: MemberEntity) {
    		const domainEntityJSON = domainEntity.export()
    		const record = this.domainJSONtoPersistence(domainEntityJSON)
    		return this.repo.save(record)
    		.then(saved => {
    			return saved
    		})
    		.catch (e => {
    			throw new Error (e)
    		})
    }

    public async findAll (
			limit: number,
			offset: number,
			search: string,
			searchableFields: string[],
			sort: string,
			sortType: string
    ) {
			const results = await this.repo
		    .createQueryBuilder('member')
		    .limit(limit)
		    .offset(offset)
		    .orderBy(sort, sortType)
		    .getMany()
		  return results.map(result => {
		  	return this.persistenceToDomain(result)
		  })
    }

		persistenceToDomain (data): MemberEntity {
    	let memberDomainEntity = new MemberEntity()
    	memberDomainEntity.import({
				id: data.id,
				FullName: data.FullName,
				Email: data.Email,
				PhoneNumber: data.PhoneNumber,
				Status: data.Status,
				RegisterDate: data.RegisterDate,
				DateOfBirth: data.DateOfBirth,
				Tier: data.Tier,
				LifetimePoint: data.LifetimePoint,
				YTDPoint: data.YTDPoint
    	})
    	return memberDomainEntity
		}

		domainJSONtoPersistence (data) {
			return {
				id: data.id,
				FullName: data.FullName,
				Email: data.Email,
				PhoneNumber: data.PhoneNumber,
				Status: data.Status,
				RegisterDate: data.RegisterDate,
				DateOfBirth: data.DateOfBirth,
				Tier: data.Tier,
				LifetimePoint: data.LifetimePoint,
				YTDPoint: data.YTDPoint
  		}
		}

}
