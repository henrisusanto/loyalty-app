import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Year'])
export class YTDPoint {

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
	  Year?: number

}
