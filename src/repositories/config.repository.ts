'use strict'
import { Config } from '../entities/config.entity'
import { ConfigRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/config.repositoryinterface'
import { ConfigEntity, ConfigJSON } from '../domain/LoyaltyCore/Entity/config.entity'
const typeorm = require('typeorm')

interface ConfigRecord {
    Id: number
    Name: string
    ConfigValue: string
}

export class ConfigRepository implements ConfigRepositoryInterface {

    protected conn
    protected repo

    constructor () {
        this.conn = typeorm.getConnection ()
        this.repo = this.conn.getRepository (Config)
    }

    public async findByName (Name: string): Promise <ConfigEntity> {
        const found = await this.repo.findOne ({Name})
        if (!found) throw new Error ('Config not found')
        return this.toDomain(found)
    }

    public async save (data: ConfigEntity): Promise <string> {
        try {
            let record = this.toPersistence (data)
            const saved = await this.repo.save (record)
            return saved.Name
        } catch (e) {
            throw new Error (e)
        }
    }

    private toDomain (data: ConfigRecord): ConfigEntity {
        let configJSON: ConfigJSON = {
            Id: data.Id,
            Name: data.Name,
            ConfigValue: data.ConfigValue
        }
        let configE = new ConfigEntity ()
        configE.fromJSON (configJSON)
        return configE
    }

    private toPersistence (data: ConfigEntity): ConfigRecord {
        let configJSON = data.toJSON ()
        return {
            Id: configJSON.Id,
            Name: configJSON.Name,
            ConfigValue: configJSON.ConfigValue
        }
    }
}
