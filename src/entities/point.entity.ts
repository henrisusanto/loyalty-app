import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Parent', 'Member', 'Time', 'LifetimeRemaining', 'LifetimeExpiredDate'])
export class Point {

    @PrimaryGeneratedColumn()
    Id: number;

		@Column()
		Parent?: number

		@Column()
		Member: number

		@Column()
		Time: Date

		@Column()
		Activity: string

		@Column()
		Reference: number

		@Column()
		YTDAmount: number

		@Column()
		LifetimeAmount: number

		@Column()
		LifetimeRemaining: number

		@Column()
		LifetimeExpiredDate: Date

		@Column()
		Remarks: string

		@Column ()
		Rate: number

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

}