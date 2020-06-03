'use strict'
import { ActivityRate } from '../entities/activityrate.entity'
import { ActivityRateRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/activityrate.repositoryinterface'
import { ActivityRateEntity, ActivityRateJSON } from '../domain/LoyaltyCore/Entity/activityrate.entity'
const typeorm = require('typeorm')

interface ActivityRateRecord {
    Code: string
    Description: string
    Rate: number
}

export class ActivityRateRepository implements ActivityRateRepositoryInterface {

    protected conn
    protected repo

    constructor () {
        this.conn = typeorm.getConnection ()
        this.repo = this.conn.getRepository (ActivityRate)
    }

    public async getAll (): Promise <ActivityRateEntity []> {
        let records = await this.repo.find ()
        return records.map (record => {
            return this.toDomain (record)
        })
    }

    public async findByCode (Code: string): Promise <ActivityRateEntity> {
        let record = await this.repo.findOne ({where: {Code}})
        return this.toDomain (record)
    }

    public async update (data: ActivityRateEntity): Promise <string> {
        let saved = await this.repo.save (this.toPersistence (data))
        return saved.Code
    }

    private toDomain (data: ActivityRateRecord): ActivityRateEntity {
        let activityRateE = new ActivityRateEntity ()
        activityRateE.fromJSON ({
            Code: data.Code,
            Description: data.Description,
            Rate: data.Rate
        })
        return activityRateE
    }

    private toPersistence (data: ActivityRateEntity): ActivityRateRecord {
        let activityRateJSON = data.toJSON ()
        return {
            Code: activityRateJSON.Code,
            Description: activityRateJSON.Description,
            Rate: activityRateJSON.Rate
        }
    }
}
