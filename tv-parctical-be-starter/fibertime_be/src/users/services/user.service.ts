import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as moment from 'moment';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findOrCreateTestUser(phoneNumber?: string): Promise<User> {
    const testPhone = phoneNumber || `+27test${Math.floor(1000 + Math.random() * 9000)}`;
    let user = await this.userRepository.findOne({ 
      where: { phone_number: testPhone } 
    });
    if (!user) {
      user = this.userRepository.create({
        phone_number: testPhone,
        is_verified: true,
        otp: '',
        otp_expires_at: undefined, 
      });
      user = await this.userRepository.save(user);
    }
    return user;
  }
  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'phone_number', 'is_verified'] 
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }
  async listUsers(limit: number = 10): Promise<User[]> {
    return this.userRepository.find({
      take: limit,
      select: ['id', 'phone_number', 'is_verified'],
    });
  }
}
