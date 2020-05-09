import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Name', 'Year'])
export class Tier {

    @PrimaryGeneratedColumn()
    Id: number;

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

	  @Column()
	  Name?: string

	  @Column()
	  Year?: number

}
