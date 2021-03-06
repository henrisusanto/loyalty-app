import { PointRepositoryInterface } from '../domain/LoyaltyCore/RepositoryInterface/point.repositoryinterface'
import { PointEntity } from '../domain/LoyaltyCore/Entity/point.entity'
import { Point } from '../entities/point.entity'
const typeorm = require ('typeorm')
const { MoreThan, LessThan, In } = typeorm

export class PointRepository implements PointRepositoryInterface {

  protected conn
  protected repo

  constructor() {
      this.conn = typeorm.getConnection()
      this.repo = this.conn.getRepository(Point)
  }

	public async findPointToUse (criteria): Promise <PointEntity []> {
		var query = this.repo
			.createQueryBuilder('point')
			.select('*')
		  .where (1)

		 Object.keys(criteria).forEach(field => {
		 	query.andWhere(`${field} ${criteria[field]}`)
		 })

		 let result = await query.getRawMany ()
		 return result.map(record => {
		 	return this.toDomain (record)
		 })
	}

	public async save (point: PointEntity): Promise <number> {
		try {
			let saved = await this.repo.save (this.toPersistence (point))
			return saved.Id
		} catch (e) {
			throw new Error (e)
		}
	}

	public async findHistory (Criteria): Promise <PointEntity []> {
		var query = this.repo
			.createQueryBuilder('point')
			.select('*')
		  .where (1)

		 Object.keys(Criteria).forEach(field => {
		 	query.andWhere(`${field} ${Criteria[field]}`)
		 })

		 let result = await query.getRawMany ()
		 return result.map(record => {
		 	return this.toDomain (record)
		 })
	}

	public async findPointByParentIds (ParentIDs: number[]): Promise <PointEntity []> {
		let domains: PointEntity [] = []
		if (ParentIDs.length > 0) {
			let found = await this.repo.find ({
				Parent: In(ParentIDs),
			})
			found.forEach(record => {
				domains.push (this.toDomain (record))
			})
		}
		return domains
	}

	public async findLifetimePointGreaterThan0SortByTime (parameter)
	: Promise <{TotalRecord: number, TotalPoint: number, Result: PointEntity []}> {

		let { TotalPoint } = await this.repo
		  .createQueryBuilder('point')
		  .select('SUM(LifetimeAmount)', 'TotalPoint')
		  .where ('LifetimeAmount > 0')
		  .andWhere (`point.Time BETWEEN ${parameter.Since} AND ${parameter.Until}`)
		  .getRawOne() || 0

		let { TotalRecord } = await this.repo
		  .createQueryBuilder('point')
		  .select('COUNT(Id)', 'TotalRecord')
		  .where ('LifetimeAmount > 0')
		  .andWhere (`point.Time BETWEEN ${parameter.Since} AND ${parameter.Until}`)
		  .getRawOne() || 0

		let found = await this.repo
			.createQueryBuilder('point')
			.select('*')
		  .where ('LifetimeAmount > 0')
		  .andWhere (`point.Time BETWEEN ${parameter.Since} AND ${parameter.Until}`)
		  .orderBy('Time', 'ASC')
		  .limit(parameter.Limit)
		  .offset(parameter.Offset)
		  .getRawMany()

		let Result = found.map(record => {
			return this.toDomain (record)
		})

		return { TotalRecord, TotalPoint, Result}
	}

	public async findLifetimePointLessThan0SortByTime (parameter)
	: Promise <{TotalRecord: number, TotalPoint: number, Result: PointEntity []}> {
		let { TotalPoint } = await this.repo
		  .createQueryBuilder('point')
		  .select('SUM(LifetimeAmount)', 'TotalPoint')
		  .where ('LifetimeAmount < 0')
		  .andWhere (`point.Time BETWEEN ${parameter.Since} AND ${parameter.Until}`)
		  .getRawOne() || 0

		let { TotalRecord } = await this.repo
		  .createQueryBuilder('point')
		  .select('COUNT(Id)', 'TotalRecord')
		  .where ('LifetimeAmount < 0')
		  .andWhere (`point.Time BETWEEN ${parameter.Since} AND ${parameter.Until}`)
		  .getRawOne() || 0

		let found = await this.repo
			.createQueryBuilder('point')
			.select('*')
		  .where ('LifetimeAmount < 0')
		  .andWhere (`point.Time BETWEEN ${parameter.Since} AND ${parameter.Until}`)
		  .orderBy('Time', 'ASC')
		  .limit(parameter.Limit)
		  .offset(parameter.Offset)
		  .getRawMany()

		let Result = found.map(record => {
			return this.toDomain (record)
		})

		return { TotalRecord, TotalPoint, Result}
	}

	public async getDistinctMemberExpiredPoint (Limit: number, ExpiredCriteria): Promise <number []> {
		var query = this.repo
		  .createQueryBuilder ('point')
		  .select ('DISTINCT Member', 'Member')
		  .where (1)
		  .limit (Limit)

		ExpiredCriteria.AND.forEach (field => {
			query.andWhere (`${field.Field} ${field.Operator} ${field.FieldValue}`)
		})

		let result = await query.getRawMany ()
		return result.map(row => {
			return row.Member
		})
	}

	public async getExpiredByMembers (Members: number [], ExpiredCriteria): Promise <PointEntity []> {
		var query = this.repo
		  .createQueryBuilder('point')
		  .select('*')
		  .where (`Member IN (${Members.join(',')})`)

		ExpiredCriteria.AND.forEach (field => {
			query.andWhere (`${field.Field} ${field.Operator} ${field.FieldValue}`)
		})

		let found = await query.getRawMany() || []
		return found.map(record => {
			return this.toDomain (record)
		})
	}

	public async delete (Id: number): Promise <boolean> {
		try {
			await this.repo.delete (Id)
			return true
		} catch (e) {
			throw new Error (e)
		}
	}

	public async findByReference (data: {Reference: number, Activity: string}): Promise <PointEntity> {
		try {
			let found = await this.repo.findOne ({where: data})
			if (!found) throw new Error ('Point not found')
			else return this.toDomain (found)
		} catch (e) {
			throw new Error (e)
		}
	}

	public async findByReferences (data: {Activity: string, References: number[]}): Promise <PointEntity[]> {
		try {
			let found = await this.repo
				.createQueryBuilder('point')
				.select('*')
				.where (`Reference IN (${data.References.join(',')})`)
				.andWhere (`Activity = '${data.Activity}'`)
				.getRawMany() || []
			return found.map(record => {
				return this.toDomain (record)
			})
		} catch (e) {
			throw new Error (e)
		}
	}

	public async findByParents (Parents: number[]): Promise <PointEntity[]> {
		try {
			let found = await this.repo
				.createQueryBuilder('point')
				.select('*')
				.where (`Parent IN (${Parents.join(',')})`)
				.getRawMany() || []
			return found.map(record => {
				return this.toDomain (record)
			})
		} catch (e) {
			throw new Error (e)
		}
	}

	private toDomain (data): PointEntity {
		let domain = new PointEntity ()
		domain.fromJSON ({
			Id: data.Id,
			Parent: data.Parent,
			Member: data.Member,
			Time: data.Time,
			Activity: data.Activity,
			Reference: data.Reference,
			YTDAmount: data.YTDAmount,
			LifetimeAmount: data.LifetimeAmount,
			LifetimeRemaining: data.LifetimeRemaining,
			LifetimeExpiredDate: data.LifetimeExpiredDate,
			Remarks: data.Remarks,
			Rate: data.Rate
		})
		return domain
	}

	private toPersistence (data: PointEntity) {
		let json = data.toJSON ()
		return {
	    Id: json.Id,
			Parent: json.Parent,
			Member: json.Member,
			Time: json.Time,
			Activity: json.Activity,
			Reference: json.Reference,
			YTDAmount: json.YTDAmount,
			LifetimeAmount: json.LifetimeAmount,
			LifetimeRemaining: json.LifetimeRemaining,
			LifetimeExpiredDate: json.LifetimeExpiredDate,
			Remarks: json.Remarks,
			Rate: json.Rate
		}
	}

}