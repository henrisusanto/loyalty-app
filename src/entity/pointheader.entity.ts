import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Member', 'Status'])
export class PointHeader {

    @PrimaryGeneratedColumn()
    Id: number;

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

	  @Column()
	  Member?: number

	  @Column()
	  Status?: string

	  @Column()
	  Amount?: number

	  @Column()
	  Remarks?: string

}
