import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { CreateDeviceCodeDto } from './dto/create-device-code.dto';
import { ConnectDeviceDto } from './dto/connect-device.dto';

describe('DeviceController', () => {
  let controller: DeviceController;
  let mockDeviceService: Partial<DeviceService>;

  beforeEach(async () => {
    mockDeviceService = {
      createDeviceCode: jest.fn(),
      connectDevice: jest.fn(),
      getDeviceByCode: jest.fn(),
      getConnectionStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        {
          provide: DeviceService,
          useValue: mockDeviceService,
        },
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDeviceCode', () => {
    it('should create a device code', async () => {
      const createDeviceCodeDto: CreateDeviceCodeDto = {
        mac_address: 'AA:BB:CC:DD:EE:FF',
      };
      const mockDeviceCode = { code: 'ABCD', mac_address: createDeviceCodeDto.mac_address };
      mockDeviceService.createDeviceCode = jest.fn().mockResolvedValue(mockDeviceCode);
      const result = await controller.createDeviceCode(createDeviceCodeDto);
      expect(result).toEqual(mockDeviceCode);
      expect(mockDeviceService.createDeviceCode).toHaveBeenCalledWith(createDeviceCodeDto.mac_address);
    });
  });

  describe('connectDevice', () => {
    it('should connect a device', async () => {
      const connectDeviceDto: ConnectDeviceDto = {
        device_id: 'device123',
      };
      const mockConnection = { 
        device_id: connectDeviceDto.device_id, 
        status: 'CONNECTED' 
      };
      const userId = 'user123';
      mockDeviceService.connectDevice = jest.fn().mockResolvedValue(mockConnection);
      const result = await controller.connectDevice(connectDeviceDto, userId);
      expect(result).toEqual(mockConnection);
      expect(mockDeviceService.connectDevice).toHaveBeenCalledWith(connectDeviceDto.device_id, userId);
    });
  });
});
