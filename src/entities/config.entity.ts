import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity()
@Index(['Id', 'Name'])
export class Config {

    @PrimaryGeneratedColumn()
    Id: number;

	  @CreateDateColumn()
	  createdAt?: Date

	  @UpdateDateColumn()
	  updatedAt?: Date

	  @Column({unique: true})
	  Name?: string

	  @Column()
	  ConfigValue?: string

}
