import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
export enum PairingCodeStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  USED = 'used',
}
@Entity()
export class PairingCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 4 })
  code: string;
  @Column({ type: 'enum', enum: PairingCodeStatus, default: PairingCodeStatus.ACTIVE })
  status: PairingCodeStatus;
  @Column({ type: 'timestamptz' })
  expiresAt: Date;
  @Column()
  macAddress: string;
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.pairingCodes, { nullable: true })
  user: User;
  @Column({ default: false })
  isConnected: boolean;
} 