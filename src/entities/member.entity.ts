import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'FullName', 'Email', 'PhoneNumber', 'RegisterDate', 'DateOfBirth'])
export class Member {

    @PrimaryGeneratedColumn()
    Id: number;

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

	  @Column()
	  FullName?: string

	  @Column({unique: true})
	  Email: string

	  @Column()
	  PhoneNumber?: string

	  @Column()
	  RegisterDate?: Date

	  @Column()
	  DateOfBirth?: Date

	  @Column()
	  Status?: Boolean

	  @Column()
	  Tier?: number

	  @Column()
	  LifetimePoint?: number

	  @Column()
	  YTDPoint?: number

	  @Column()
	  LifetimeVisit?: number

	  @Column()
	  YTDVisit?: number

	  @Column({ type: 'bigint' })
	  LifetimeSpending?: number

	  @Column({ type: 'bigint' })
	  YTDSpending?: number
}
