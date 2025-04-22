import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PairingCode, PairingCodeStatus } from './entities/pairing-code.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as moment from 'moment';
import { User } from '../users/entities/user.entity';
import { DeviceGateway } from './device.gateway';
import { MockType } from '../common/test/mock.type';
describe('DeviceService', () => {
  let service: DeviceService;
  let pairingCodeRepo: MockType<Repository<PairingCode>>;
  let userRepo: MockType<Repository<User>>;
  let deviceGateway: DeviceGateway;
  const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  }));
  const mockPairingCode = new PairingCode();
  mockPairingCode.code = 'ABCD';
  mockPairingCode.macAddress = '00:11:22:33:44:55';
  mockPairingCode.expiresAt = moment().add(5, 'minutes').toDate();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(PairingCode),
          useFactory: repositoryMockFactory,
        },
        {
          provide: DeviceGateway,
          useValue: { notifyConnectionStatus: jest.fn() },
        },
      ],
    }).compile();
    service = module.get<DeviceService>(DeviceService);
    pairingCodeRepo = module.get(getRepositoryToken(PairingCode));
    userRepo = module.get(getRepositoryToken(User));
    deviceGateway = module.get<DeviceGateway>(DeviceGateway);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createDeviceCode', () => {
    it('createDeviceCode should create a new device code', async () => {
      const mac_address = '00:11:22:33:44:55';
      pairingCodeRepo.create?.mockReturnValue(mockPairingCode);
      pairingCodeRepo.save?.mockResolvedValue(mockPairingCode);
      const result = await service.createDeviceCode(mac_address);
      expect(result.code).toBeDefined();
      expect(result.code).toHaveLength(4);
    });
  });
  describe('getDevice', () => {
    it('getDevice should throw NotFoundException for non-existent code', async () => {
      const code = 'ABCD';
      pairingCodeRepo.findOne?.mockResolvedValue(null);
      await expect(service.getDeviceByCode(code)).rejects.toThrow(NotFoundException);
    });
    it('getDevice should throw BadRequestException for expired device code', async () => {
      const code = 'ABCD';
      const expiredCode = { ...mockPairingCode, expiresAt: moment().subtract(1, 'minute').toDate() };
      pairingCodeRepo.findOne?.mockResolvedValue(expiredCode);
      await expect(service.getDeviceByCode(code)).rejects.toThrow(BadRequestException);
    });
    it('getDevice should return device for valid code', async () => {
      const code = 'ABCD';
      const validCode = { ...mockPairingCode, expiresAt: moment().add(4, 'minutes').toDate() };
      pairingCodeRepo.findOne?.mockResolvedValue(validCode);
      const result = await service.getDeviceByCode(code);
      expect(result).toBe(validCode);
    });
  });
});
