'use strict'
import { TierHistory } from '../entities/tierhistory.entity'
import { TierHistoryEntity } from '../domain/LoyaltyCore/Entity/tierhistory.entity'
import { TierHistoryRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/tierhistory.repositoryinterface'
const typeorm = require('typeorm')

interface TierHistoryRecord {
    Id: number
    Member: number
    Time: Date
    PreviosTier: number
    NextTier: number
    MemberField: string
    FieldValue: number
}

export class TierHistoryRepository implements TierHistoryRepositoryInterface {

    protected conn
    protected repo

    constructor () {
        this.conn = typeorm.getConnection ()
        this.repo = this.conn.getRepository (TierHistory)
    }

    public async insert (data: TierHistoryEntity): Promise <number> {
        let saved = await this.repo.save (this.toPersistence (data))
        return saved.Id
    }

    private toPersistence (data: TierHistoryEntity): TierHistoryRecord {
        let json = data.toJSON ()
        return {
            Id: json.Id,
            Member: json.Member,
            Time: json.Time,
            PreviosTier: json.PreviousTier,
            NextTier: json.NextTier,
            MemberField: json.MemberField,
            FieldValue: json.FieldValue
        }
    }
}
