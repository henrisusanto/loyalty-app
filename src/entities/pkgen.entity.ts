import { Entity, PrimaryGeneratedColumn, Index } from "typeorm"

@Entity()
@Index(['id'])
export class PKGen {

    @PrimaryGeneratedColumn()
    id: number;

}
