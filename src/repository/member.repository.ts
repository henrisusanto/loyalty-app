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

    public async create (domainEntity: MemberEntity) {
    	const generated = await this.conn.getRepository(PKGen).save({})
    	domainEntity.setId(generated.id)
    	this.conn.getRepository(PKGen).delete(generated.id)
    }

    public async save (domainEntity: MemberEntity) {
    		const dbEntity = this.mapToDatabase(domainEntity)
    		return this.repo.save(dbEntity)
    		.then(saved => {
    			return saved
    		})
    		.catch (e => {
    			throw new Error (e)
    		})
    }

    public mapToDomain (data) {
    	var memberDomainEntity = new MemberEntity()
    	return memberDomainEntity
    }

    public mapToDatabase (domainEntity: MemberEntity) {
    	return {
    			id: domainEntity.getId(),
					FullName: domainEntity.getFullName (),
					Email: domainEntity.getEmail (),
					PhoneNumber: domainEntity.getPhoneNumber (),
					RegisterDate: domainEntity.getRegisterDate (),
					DateOfBirth: domainEntity.getDateOfBirth ()
    	}
    }
}
