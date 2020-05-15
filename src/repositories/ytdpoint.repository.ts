'use strict'
import { YTDPoint } from '../entities/ytdpoint.entity'
import { YTDPointRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/ytdpoint.repositoryinterface'
import { YTDPointEntity, YTDPointJSON } from '../domain/LoyaltyCore/Entity/ytdpoint.entity'
const typeorm = require('typeorm')

interface YTDPointRecord {
    Id?: number
    Activity?: string
    Reference?: number
    Member?: number
    Amount?: number
    Year?: number
    Remarks?: string
}

export class YTDPointRepository implements YTDPointRepositoryInterface {

    protected conn
    protected repo

    constructor () {
        this.conn = typeorm.getConnection ()
        this.repo = this.conn.getRepository (YTDPoint)
    }

    public async findCurrentYearByMember (Member: number): Promise <YTDPointEntity []> {
        let records = await this.repo.find ({
            where: {
                Member,
                Year: new Date().getFullYear()
            }
        })
        let domains: YTDPointEntity[] = []
        for (let record of records) domains.push(this.toDomain (record))
        return domains
    }

    public async bulkInsert (data: YTDPointEntity[]): Promise <number[]> {
        let IDs: number [] = []
        for (let domain of data) {
            let saved = await this.repo.save (this.toPersistence (domain))
            IDs.push (saved.Id)
        }
        return IDs
    }

    private toDomain (data: YTDPointJSON): YTDPointEntity {
        let domain = new YTDPointEntity ()
        domain.fromJSON (data)
        return domain
    }

    private toPersistence (data: YTDPointEntity): YTDPointRecord {
        let json = data.toJSON ()
        return {
            Id: json.Id,
            Activity: json.Activity,
            Reference: json.Reference,
            Member: json.Member,
            Amount: json.Amount,
            Year: json.Year,
            Remarks: json.Remarks
        }
    }
}
