'use strict'
import { MemberPoint } from '../entities/memberpoint.entity'
import { MemberPointRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/memberpoint.repositoryinterface'
import { MemberPointEntity, MemberPointJSON } from '../domain/LoyaltyCore/Entity/memberpoint.entity'
const typeorm = require('typeorm')

interface MemberPointRecord {
    Id?: number
    Parent: number
    Member: number
    Time: Date
    PointType: string
    Amount: number
    Remarks: string
    Activity: string
    Reference: number
}

export class MemberPointRepository implements MemberPointRepositoryInterface {

    protected conn
    protected repo

    constructor () {
        this.conn = typeorm.getConnection ()
        this.repo = this.conn.getRepository (MemberPoint)
    }

    public async bulkInsert (data: MemberPointEntity[]): Promise <number []> {
        var IDs: number [] = []
        data.forEach (domain => {
            let saved = this.repo.save (this.toPersistence (domain))
            IDs.push (saved.Id)
        })
        return IDs
    }

    public triggerAfterInsertMemberPoint (data: MemberPointEntity): void {}

    public async getLifetimeMemberPointHasNoParentSortByTimeByMember (Member: number): Promise <MemberPointEntity []> {
        let found: MemberPointEntity [] = []
        return found
    }

    public async getMemberPointListByIds (IDs: number []): Promise <MemberPointEntity []> {
        let found: MemberPointEntity [] = []
        return found
    }

    private toDomain (data: MemberPointRecord): MemberPointEntity {
        let domain = new MemberPointEntity ()
        domain.fromJSON ({
            Id: data.Id || 0,
            Parent: data.Parent,
            Member: data.Member,
            PointType: data.PointType,
            Amount: data.Amount,
            Time: data.Time,
            Activity: data.Activity,
            Reference: data.Reference,
            Remarks: data.Remarks
        })
        return domain
    }

    private toPersistence (data: MemberPointEntity): MemberPointRecord {
        let json = data.toJSON ()
        return {
            Id: json.Id,
            Parent: json.Parent,
            Member: json.Member,
            Time: json.Time,
            PointType: json.PointType,
            Amount: json.Amount,
            Remarks: json.Remarks,
            Activity: json.Activity,
            Reference: json.Reference
        }
    }
}
