import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Parent', 'Member', 'Time', 'PointType'])
export class MemberPoint {

    @PrimaryGeneratedColumn()
    Id: number;

	  @Column()
	  Parent?: number

	  @Column()
	  Member?: number

	  @Column()
	  Time?: Date

	  @Column()
	  PointType?: string

	  @Column()
	  Amount?: number

	  @Column()
	  Remarks?: string

	  @Column()
	  Activity?: string

	  @Column()
	  Reference?: number

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date
}
