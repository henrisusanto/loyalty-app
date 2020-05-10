import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'ExpiredDate'])
export class PointDetail {

    @PrimaryGeneratedColumn()
    Id: number

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn()
    updatedAt?: Date

    @Column()
    PointHeader: number

    @Column()
    YTDAmount: number

    @Column()
    LifetimeAmount: number

    @Column()
    Activity: string

    @Column()
    ExpiredDate?: Date

}
