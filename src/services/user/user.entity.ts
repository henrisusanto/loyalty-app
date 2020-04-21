import { Entity, Column, Index } from 'typeorm'
import { BasicEntity } from 'fastro'

@Entity()
@Index(['id', 'email', 'username'])
export class User extends BasicEntity {
  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  username?: string

  @Column()
  password?: string
}
