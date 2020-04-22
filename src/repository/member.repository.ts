'use strict'
import { Member } from '../entity/member.entity'
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

    public async save (domainEntity: MemberEntity) {
    		const dbEntity = this.mapToDatabase(domainEntity)
    		this.repo.save(dbEntity)
    }

    public mapToDomain (data) {
    	var memberDomainEntity = new MemberEntity()
    	return memberDomainEntity
    }

    public mapToDatabase (data: MemberEntity) {
    	return {
					FullName: data.getFullName (),
					Email: data.getEmail (),
					PhoneNumber: data.getPhoneNumber (),
					RegisterDate: data.getRegisterDate (),
					DateOfBirth: data.getDateOfBirth ()
    	}
    }
}
