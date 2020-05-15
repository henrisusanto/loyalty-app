import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Member', 'Remarks'])
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
	  YTD?: number

	  @Column()
	  Lifetime?: number

	  @Column()
	  LifetimeDateIn?: Date

	  @Column()
	  Remarks?: string

}