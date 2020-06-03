import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Code'])
export class ActivityRate {

    @PrimaryColumn()
    Code: string;

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

	  @Column()
	  Description: string

	  @Column()
	  Rate: number

}
