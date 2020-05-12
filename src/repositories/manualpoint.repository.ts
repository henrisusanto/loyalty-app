'use strict'
import { ManualPoint } from '../entities/manualpoint.entity'
import { ManualPointRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/manualpoint.repositoryinterface'
import { ManualPointAggregateRoot } from '../domain/LoyaltyCore/AggregateRoot/manualpoint.aggregateroot'
const typeorm = require('typeorm')

interface ManualPointRecord {
    Member: number
    ManualDate: Date
    YTD: number
    Lifetime: number
    Remarks: string
}

export class ManualPointRepository implements ManualPointRepositoryInterface {

    protected conn
    protected repo

    constructor () {
        this.conn = typeorm.getConnection ()
        this.repo = this.conn.getRepository (ManualPoint)
    }

    public async insert (data: ManualPointAggregateRoot): Promise <number> {
        try {
            let record = this.toPersistence (data)
            const saved = await this.repo.save (record)
            return saved.Id
        } catch (e) {
            throw new Error (e)
        }
    }

    private toPersistence (data: ManualPointAggregateRoot): ManualPointRecord {
        let ManualPointJSON = data.toJSON ()
        return {
            Member: ManualPointJSON.Member,
            ManualDate: ManualPointJSON.ManualDate,
            YTD: ManualPointJSON.YTD,
            Lifetime: ManualPointJSON.Lifetime,
            Remarks: ManualPointJSON.Remarks
        }
    }
}
