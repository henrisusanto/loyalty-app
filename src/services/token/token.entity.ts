import { Entity, Column, Index } from 'typeorm'
import { BasicEntity } from 'fastro'

@Entity()
@Index(['id', 'userId', 'token'])
export class UserToken extends BasicEntity {
  @Column()
  userId: string

  @Column({ unique: true })
  token?: string
}
