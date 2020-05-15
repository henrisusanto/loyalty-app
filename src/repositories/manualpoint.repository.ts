'use strict'
import { ManualPoint } from '../entities/manualpoint.entity'
import { ManualPointRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/manualpoint.repositoryinterface'
import { ManualPointEntity, ManualPointJSON } from '../domain/LoyaltyCore/Entity/manualpoint.entity'
import { PKGen } from '../entities/pkgen.entity'
const typeorm = require('typeorm')

interface ManualPointRecord {
    Id: number
    Member: number
    YTD?: number
    Lifetime?: number
    LifetimeDateIn?: Date
    Remarks?: string
}

export class ManualPointRepository implements ManualPointRepositoryInterface {

    protected conn
    protected repo

    constructor () {
        this.conn = typeorm.getConnection ()
        this.repo = this.conn.getRepository (ManualPoint)
    }

    public async generateId (): Promise <number> {
        const generated = await this.conn.getRepository(PKGen).save({})
        return generated.id
    }

    public async insert (data: ManualPointEntity): Promise <number> {
        let saved = await this.repo.save (this.toPersistence (data))
        return saved.Id
    }

    private toPersistence (data: ManualPointEntity): ManualPointRecord {
        let manualPointJSON = data.toJSON ()
        return {
            Id: manualPointJSON.Id,
            Member: manualPointJSON.Member,
            YTD: manualPointJSON.YTD,
            Lifetime: manualPointJSON.Lifetime,
            LifetimeDateIn: manualPointJSON.LifetimeDateIn,
            Remarks: manualPointJSON.Remarks
        }
    }
}
