import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as moment from 'moment';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: Partial<Repository<User>>;
  let mockJwtService: Partial<JwtService>;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestOTP', () => {
    it('should generate OTP for a new user', async () => {
      const phoneNumber = '+27123456789';
      
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);
      mockUserRepository.create = jest.fn().mockReturnValue({ phone_number: phoneNumber });
      mockUserRepository.save = jest.fn();

      const result = await service.requestOTP(phoneNumber);

      expect(result).toHaveProperty('message');
      expect(result.message).toBe('OTP sent successfully');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should generate OTP for existing user', async () => {
      const phoneNumber = '+27123456789';
      const existingUser = { phone_number: phoneNumber };
      
      mockUserRepository.findOne = jest.fn().mockResolvedValue(existingUser);
      mockUserRepository.save = jest.fn();

      const result = await service.requestOTP(phoneNumber);

      expect(result).toHaveProperty('message');
      expect(result.message).toBe('OTP sent successfully');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('verifyOTP', () => {
    it('should verify valid OTP', async () => {
      const phoneNumber = '+27123456789';
      const otp = '123456';
      const user = {
        id: 'user123',
        phone_number: phoneNumber,
        otp,
        otp_expires_at: moment().add(5, 'minutes').toDate(),
        is_verified: false,
      };
      
      mockUserRepository.findOne = jest.fn().mockResolvedValue(user);
      mockUserRepository.save = jest.fn();
      mockJwtService.sign = jest.fn().mockReturnValue('fake_token');

      const result = await service.verifyOTP(phoneNumber, otp);

      expect(result).toHaveProperty('token');
      expect(result.token).toBe('fake_token');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw error for invalid OTP', async () => {
      const phoneNumber = '+27123456789';
      const otp = '123456';
      const user = {
        phone_number: phoneNumber,
        otp: '654321',
        otp_expires_at: moment().add(5, 'minutes').toDate(),
      };
      
      mockUserRepository.findOne = jest.fn().mockResolvedValue(user);

      await expect(service.verifyOTP(phoneNumber, otp)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error for expired OTP', async () => {
      const phoneNumber = '+27123456789';
      const otp = '123456';
      const user = {
        phone_number: phoneNumber,
        otp,
        otp_expires_at: moment().subtract(5, 'minutes').toDate(),
      };
      
      mockUserRepository.findOne = jest.fn().mockResolvedValue(user);

      await expect(service.verifyOTP(phoneNumber, otp)).rejects.toThrow(UnauthorizedException);
    });
  });
});
