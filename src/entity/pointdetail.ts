import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Member', 'Status', 'ExpiredDate'])
export class PointDetail {

    @PrimaryGeneratedColumn()
    Id: number

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

    @PrimaryGeneratedColumn()
    PointHeader: number

    @PrimaryGeneratedColumn()
    Amount: number

    @PrimaryGeneratedColumn()
    Activity: string

	  @UpdateDateColumn()
	  ExpiredDate?: Date

}
