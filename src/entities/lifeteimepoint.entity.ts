import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Member', 'ExpiredDate', 'Activity', 'Reference', 'Remaining', 'Remarks'])
export class LifetimePoint {

    @PrimaryGeneratedColumn()
    Id: number;

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

	  @Column()
	  Activity?: string

	  @Column()
	  Reference?: number

	  @Column()
	  Member?: number

	  @Column()
	  Amount?: number

	  @Column()
	  Remaining?: number

	  @Column()
	  DateIn?: Date

	  @Column()
	  ExpiredDate?: Date

	  @Column()
	  Remarks?: string
}
