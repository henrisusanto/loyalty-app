import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'DateIn'])
export class LifetimePointIn {

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
	  DateIn?: Date

	  @Column()
	  Available: number

}
