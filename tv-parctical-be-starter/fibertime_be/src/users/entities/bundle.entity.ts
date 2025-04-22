import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Bundle {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column('decimal', { precision: 10, scale: 2 })
  data_balance: number;
  @Column()
  expiry_date: Date;
  @ManyToOne(() => User, user => user.bundles)
  user: User;
  @Column({ default: true })
  is_active: boolean;
}
