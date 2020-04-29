import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Tier', 'MemberField', 'ThresholdValue'])
export class TierQualification {

    @PrimaryGeneratedColumn()
    Id: number;

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

	  @Column()
	  Tier?: number

	  @Column()
	  MemberField?: string

	  @Column()
	  ThresholdValue?: number

}
