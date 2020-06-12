import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Member'])
export class Transaction {

    @PrimaryGeneratedColumn()
    Id?: number;

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn()
    updatedAt?: Date

    @Column()
    TrxId: string

    @Column()
    Member: number

    @Column()
    Time: Date

    @Column()
    Spending: number
}
