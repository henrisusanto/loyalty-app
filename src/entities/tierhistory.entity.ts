import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Member', 'Time'])
export class TierHistory {

    @PrimaryGeneratedColumn()
    Id: number;

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

	  @Column()
	  Member: number

	  @Column()
	  Time: Date

	  @Column()
	  PreviosTier: number

	  @Column()
	  NextTier: number

	  @Column()
	  MemberField: string

	  @Column()
	  FieldValue: number

}
