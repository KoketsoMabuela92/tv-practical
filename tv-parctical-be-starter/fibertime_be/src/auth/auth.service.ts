import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as moment from 'moment';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  async requestOTP(phone_number: string): Promise<{ message: string }> {
    let user = await this.userRepository.findOne({ where: { phone_number } });
    if (!user) {
      user = this.userRepository.create({ phone_number });
    }
    const otp = this.generateOTP();
    user.otp = otp;
    user.otp_expires_at = moment().add(5, 'minutes').toDate();
    await this.userRepository.save(user);
    console.log(`OTP for ${phone_number}: ${otp}`);
    return { message: 'OTP sent successfully' };
  }
  async verifyOTP(phone_number: string, otp: string): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { phone_number } });
    if (!user || user.otp !== otp || moment().isAfter(user.otp_expires_at)) {
      throw new UnauthorizedException('Invalid OTP or OTP expired');
    }
    user.is_verified = true;
    user.otp = '';
    user.otp_expires_at = new Date();
    await this.userRepository.save(user);
    const token = this.jwtService.sign({ userId: user.id, phone_number });
    return { token };
  }
}
