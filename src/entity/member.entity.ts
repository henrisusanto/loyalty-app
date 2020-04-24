import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['id', 'FullName', 'Email', 'PhoneNumber', 'RegisterDate', 'DateOfBirth'])
export class Member {

    @PrimaryColumn()
    id: number;

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

	  @Column()
	  FullName?: string

	  @Column({unique: true})
	  Email: string

	  @Column()
	  PhoneNumber?: string

	  @Column()
	  RegisterDate?: Date

	  @Column()
	  DateOfBirth?: Date

	  @Column()
	  Status?: Boolean

	  @Column()
	  LifetimePoint?: number

	  @Column()
	  YTDPoint?: number
}
