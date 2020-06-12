'use strict'
import { TransactionEntity } from '../domain/Transaction/Entity/transaction.entity'
import { TransactionRepositoryInterface } from '../domain/Transaction/RepositoryInterface/transaction.repositoryinterface'
import { Transaction } from '../entities/transaction.entity'
const typeorm = require('typeorm')

interface TransactionRecord {
    Id?: number
    TrxId: string
    Member: number
    Time: Date
    Spending: number
}

export class TransactionRepository implements TransactionRepositoryInterface {

    protected conn
    protected repo

    constructor () {
        this.conn = typeorm.getConnection ()
        this.repo = this.conn.getRepository (Transaction)
    }

	public async insert (domain: TransactionEntity): Promise <number> {
        try {
            let saved = await this.repo.save (this.toPersistence (domain))
            return saved.Id
        } catch (e) {
            throw new Error (e)
        }
    }

    public async update (domain: TransactionEntity): Promise <number> {
        try {
            let saved = await this.repo.save (this.toPersistence (domain))
            return saved.Id
        } catch (e) {
            throw new Error (e)
        }
    }

    public async delete (Id: number): Promise <boolean> {
        try {
            let saved = await this.repo.delete (Id)
            return true
        } catch (e) {
            throw new Error (e)
        }
    }

    public async findByMember (Member: number): Promise <TransactionEntity []> {
        try {
            let found = await this.repo.find ({where: {Member}})
            if (!found) throw new Error ('Transaction not found')
            else return found.map (trx => this.toDomain (trx))
        } catch (e) {
            throw new Error (e)
        }
    }

    public async findById (Id: number): Promise <TransactionEntity> {
        try {
            let found = await this.repo.findOne ({where: {Id}})
            if (!found) throw new Error ('Transaction not found')
            else return this.toDomain (found)
        } catch (e) {
            throw new Error (e)
        }
    }

    public async getReport (parameter): Promise <{ TotalRecord: number, TotalSpending: number, Result: TransactionEntity [] }> {
        try {
            let { Limit, Offset, Since, Until, Sort, SortType } = parameter

            let { TotalSpending } = await this.repo
                .createQueryBuilder('transaction')
                .select('SUM(Spending)', 'TotalSpending')
                .andWhere (`transaction.Time BETWEEN ${Since} AND ${Until}`)
                .getRawOne() || 0

            let { TotalRecord } = await this.repo
                .createQueryBuilder('transaction')
                .select('COUNT(Id)', 'TotalRecord')
                .andWhere (`transaction.Time BETWEEN ${Since} AND ${Until}`)
                .getRawOne() || 0

            let found = await this.repo
                .createQueryBuilder('transaction')
                .select('*')
                .andWhere (`transaction.Time BETWEEN ${Since} AND ${Until}`)
                .orderBy(Sort, SortType)
                .limit(Limit)
                .offset(Offset)
                .getRawMany()

            let Result = found.map(record => this.toDomain (record))
            return { TotalRecord, TotalSpending, Result}
        } catch (e) {
            throw new Error (e)
        }
    }

    private toDomain (json: TransactionRecord): TransactionEntity {
        let domain = new TransactionEntity ()
        domain.fromJSON ({
            Id: json.Id,
            TrxId: json.TrxId,
            Member: json.Member,
            Time: json.Time,
            Spending: json.Spending
        })
        return domain
    }

    private toPersistence (domain: TransactionEntity): TransactionRecord {
        let json = domain.toJSON ()
        return {
            Id: json.Id,
            TrxId: json.TrxId,
            Member: json.Member,
            Time: json.Time,
            Spending: json.Spending
        }
    }
}
