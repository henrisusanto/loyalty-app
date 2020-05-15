import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Activity', 'Reference', 'LifetimeId', 'Remarks'])
export class LifetimePointUsage {

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
	  LifetimeId?: number

	  @Column()
	  Amount?: number

	  @Column()
	  Remarks?: string

}
