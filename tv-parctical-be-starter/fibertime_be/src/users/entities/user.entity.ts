import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PairingCode } from '../../device/entities/pairing-code.entity';
import { Bundle } from './bundle.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  phone_number: string;
  @Column({ nullable: true })
  otp: string;
  @Column({ nullable: true })
  otp_expires_at: Date;
  @Column({ default: false })
  is_verified: boolean;
  @OneToMany(() => PairingCode, (pairingCode) => pairingCode.user)
  pairingCodes: PairingCode[];
  @OneToMany(() => Bundle, bundle => bundle.user)
  bundles: Bundle[];
}
