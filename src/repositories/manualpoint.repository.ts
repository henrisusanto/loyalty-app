'use strict'
import { ManualPoint } from '../entities/manualpoint.entity'
import { ManualPointRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/manualpoint.repositoryinterface'
import { ManualPointAggregateRoot } from '../domain/LoyaltyCore/AggregateRoot/manualpoint.aggregateroot'
import { PKGen } from '../entities/pkgen.entity'
import { YTDPoint } from '../entities/ytdpoint.entity'
import { LifetimePointIn } from '../entities/lifetimepointin.entity'
const typeorm = require('typeorm')

interface ManualPointRecord {
    Member: number
    ManualDate: Date
    YTD: number
    Lifetime: number
    Remarks: string
}

interface YTDPointRecord {
    Activity: string
    Reference: number
    Member: number
    Amount: number
    Year: number
}

interface LifetimePointInRecord {
    Id: number
    Activity: string
    Reference: number
    Member: number
    Amount: number
    DateIn: Date
    Available: number
}

export class ManualPointRepository implements ManualPointRepositoryInterface {

    protected conn
    protected repo
    protected ytdRepo
    protected ltinRepo

    constructor () {
        this.conn = typeorm.getConnection ()
        this.repo = this.conn.getRepository (ManualPoint)
        this.ytdRepo = this.conn.getRepository (YTDPoint)
        this.ltinRepo = this.conn.getRepository (LifetimePointIn)
    }

    public async generateId (): Promise <number> {
        const generated = await this.conn.getRepository(PKGen).save({})
        return generated.id
    }

    public async insert (data: ManualPointAggregateRoot): Promise <number> {
        try {
            let { manual, ytd, ltin } = this.toPersistence (data)
            const saved = await this.repo.save (manual)
            this.ytdRepo.save (ytd)
            this.ltinRepo.save (ltin)
            return saved.Id
        } catch (e) {
            throw new Error (e)
        }
    }

    private toPersistence (data: ManualPointAggregateRoot): {manual: ManualPointRecord, ytd: YTDPointRecord[], ltin: LifetimePointInRecord[]} {
        let manualJSON = data.toJSON ()
        let manual = {
            Member: manualJSON.Member,
            ManualDate: manualJSON.ManualDate,
            YTD: manualJSON.YTD,
            Lifetime: manualJSON.Lifetime,
            Remarks: manualJSON.Remarks
        }

        let ytd: YTDPointRecord[] = []
        for (let y of manualJSON.YTDPoint) ytd.push ({
            Activity: y.Activity,
            Reference: y.Reference,
            Member: y.Member,
            Amount: y.Amount,
            Year: y.Year,
        })

        let ltin: LifetimePointInRecord[] = []
        for (let l of manualJSON.LifetimePointIn) ltin.push ({
            Id: l.Id,
            Activity: l.Activity,
            Reference: l.Reference,
            Member: l.Member,
            Amount: l.Amount,
            DateIn: l.DateIn,
            Available: l.Available
        })

        return {manual, ytd, ltin}
    }
}
