import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Member'])
export class ManualPoint {

    @PrimaryGeneratedColumn()
    Id: number;

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

	  @Column()
	  Member?: number

	  @Column()
	  ManualDate?: Date

	  @Column()
	  YTD?: number

	  @Column()
	  Lifetime?: number

	  @Column()
	  Remarks?: string
}
