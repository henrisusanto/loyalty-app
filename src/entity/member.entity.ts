import { Entity, Column, Index } from 'typeorm'
import { BasicEntity } from 'fastro'

@Entity()
@Index(['id', 'FullName', 'Email', 'PhoneNumber', 'RegisterDate', 'DateOfBirth'])
export class Member extends BasicEntity {
  @Column()
  FullName?: string

  @Column({ unique: true })
  Email: string

  @Column()
  PhoneNumber?: string

  @Column()
  RegisterDate?: Date

  @Column()
  DateOfBirth?: Date
}
