import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('requestOTP', () => {
    it('should create new user and OTP if user does not exist', async () => {
      const phone_number = '+27123456789';
      const mockUser = new User();
      mockUser.phone_number = phone_number;
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      const result = await service.requestOTP(phone_number);
      expect(result).toEqual({ message: 'OTP sent successfully' });
      expect(mockUserRepository.create).toHaveBeenCalledWith({ phone_number });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
    it('should update existing user with new OTP', async () => {
      const phone_number = '+27123456789';
      const mockUser = new User();
      mockUser.phone_number = phone_number;
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      const result = await service.requestOTP(phone_number);
      expect(result).toEqual({ message: 'OTP sent successfully' });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });
  describe('verifyOTP', () => {
    it('should throw UnauthorizedException for invalid OTP', async () => {
      const phone_number = '+27123456789';
      const otp = '123456';
      const mockUser = new User();
      mockUser.phone_number = phone_number;
      mockUser.otp = '654321';
      mockUser.otp_expires_at = moment().subtract(1, 'minute').toDate();
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      await expect(service.verifyOTP(phone_number, otp)).rejects.toThrow();
    });
    it('should return JWT token for valid OTP', async () => {
      const phone_number = '+27123456789';
      const otp = '123456';
      const mockUser = new User();
      mockUser.id = '1';
      mockUser.phone_number = phone_number;
      mockUser.otp = otp;
      mockUser.otp_expires_at = moment().add(4, 'minutes').toDate();
      const mockToken = 'jwt-token';
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);
      const result = await service.verifyOTP(phone_number, otp);
      expect(result).toEqual({ token: mockToken });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ 
        userId: mockUser.id, 
        phone_number 
      });
    });
  });
});
