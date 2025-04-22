import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairingCode } from './entities/pairing-code.entity';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { DeviceGateway } from './device.gateway';
import { User } from '../users/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([PairingCode, User])],
  controllers: [DeviceController],
  providers: [DeviceService, DeviceGateway],
  exports: [DeviceService],
})
export class DeviceModule {} 