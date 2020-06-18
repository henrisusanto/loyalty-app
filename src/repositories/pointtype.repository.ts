'use strict'
import { PointType } from '../entities/pointtype.entity'
import { PointTypeRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/pointtype.repositoryinterface'
import { PointTypeEntity, PointTypeJSON } from '../domain/LoyaltyCore/Entity/pointtype.entity'
const typeorm = require('typeorm')

interface PointTypeRecord {
    Code: string
    Description: string
    Rate: number
    ExpiredMonth: number
}

export class PointTypeRepository implements PointTypeRepositoryInterface {

    protected conn
    protected repo

    constructor () {
        this.conn = typeorm.getConnection ()
        this.repo = this.conn.getRepository (PointType)
    }

    public async getAll (): Promise <PointTypeEntity []> {
        let records = await this.repo.find ()
        return records.map (record => {
            return this.toDomain (record)
        })
    }

    public async findByCode (Code: string): Promise <PointTypeEntity> {
        try {
            let record = await this.repo.findOne ({where: {Code}})
            if (!record) throw new Error ('Rate not found')
            return this.toDomain (record)
        } catch (e) {
            throw new Error (e)
        }
    }

    public async update (data: PointTypeEntity): Promise <string> {
        let saved = await this.repo.save (this.toPersistence (data))
        return saved.Code
    }

    private toDomain (data: PointTypeRecord): PointTypeEntity {
        let activityRateE = new PointTypeEntity ()
        activityRateE.fromJSON ({
            Code: data.Code,
            Description: data.Description,
            Rate: data.Rate,
            ExpiredMonth: data.ExpiredMonth
        })
        return activityRateE
    }

    private toPersistence (data: PointTypeEntity): PointTypeRecord {
        let activityRateJSON = data.toJSON ()
        return {
            Code: activityRateJSON.Code,
            Description: activityRateJSON.Description,
            Rate: activityRateJSON.Rate,
            ExpiredMonth: activityRateJSON.ExpiredMonth
        }
    }
}
