import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: Partial<Repository<User>>;
  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findOrCreateTestUser', () => {
    it('should create a new test user if not exists', async () => {
      const mockUser = new User();
      mockUser.phone_number = '+27test1234';
      mockUser.is_verified = true;
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);
      mockUserRepository.create = jest.fn().mockReturnValue(mockUser);
      mockUserRepository.save = jest.fn().mockResolvedValue(mockUser);
      const result = await service.findOrCreateTestUser();
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result.phone_number).toMatch(/^\+27test\d{4}$/);
      expect(result.is_verified).toBe(true);
    });
    it('should return existing test user', async () => {
      const existingUser = new User();
      existingUser.phone_number = '+27test5678';
      mockUserRepository.findOne = jest.fn().mockResolvedValue(existingUser);
      const result = await service.findOrCreateTestUser('+27test5678');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
      expect(result.phone_number).toBe('+27test5678');
    });
  });
});
