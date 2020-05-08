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
    Amount: number

    @Column()
    Activity: string

    @Column()
    ExpiredDate?: Date

}
