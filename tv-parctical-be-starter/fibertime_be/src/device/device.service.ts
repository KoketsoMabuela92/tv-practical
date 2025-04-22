import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PairingCode, PairingCodeStatus } from './entities/pairing-code.entity';
import { User } from '../users/entities/user.entity';
import { DeviceGateway } from './device.gateway';
import * as moment from 'moment';
@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(PairingCode)
    private readonly pairingCodeRepository: Repository<PairingCode>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly deviceGateway: DeviceGateway,
  ) {}
  async createDeviceCode(macAddress: string): Promise<PairingCode> {
    await this.pairingCodeRepository.update(
      { macAddress, status: PairingCodeStatus.ACTIVE },
      { status: PairingCodeStatus.EXPIRED },
    );
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const pairingCode = this.pairingCodeRepository.create({
      code,
      macAddress,
      expiresAt: moment().add(5, 'minutes').toDate(),
      status: PairingCodeStatus.ACTIVE,
    });
    return this.pairingCodeRepository.save(pairingCode);
  }
  async getDeviceByCode(code: string): Promise<PairingCode> {
    const pairingCode = await this.pairingCodeRepository.findOne({
      where: { code, status: PairingCodeStatus.ACTIVE },
      relations: ['user'],
    });
    if (!pairingCode) {
      throw new NotFoundException('Invalid or expired pairing code');
    }
    if (moment().isAfter(pairingCode.expiresAt)) {
      pairingCode.status = PairingCodeStatus.EXPIRED;
      await this.pairingCodeRepository.save(pairingCode);
      throw new BadRequestException('Pairing code has expired');
    }
    return pairingCode;
  }
  async connectDevice(deviceCode: string, userId: string): Promise<PairingCode> {
    const pairingCode = await this.pairingCodeRepository.findOne({
      where: { code: deviceCode, status: PairingCodeStatus.ACTIVE },
    });
    if (!pairingCode) {
      throw new NotFoundException('Device not found or code expired');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    pairingCode.user = user;
    pairingCode.isConnected = true;
    pairingCode.status = PairingCodeStatus.USED;
    const savedPairingCode = await this.pairingCodeRepository.save(pairingCode);
    this.deviceGateway.notifyConnectionStatus(pairingCode.id, true);
    return savedPairingCode;
  }
  async getConnectionStatus(deviceCode: string): Promise<{ isConnected: boolean }> {
    const pairingCode = await this.pairingCodeRepository.findOne({
      where: { code: deviceCode },
    });
    if (!pairingCode) {
      throw new NotFoundException('Device not found');
    }
    return { isConnected: pairingCode.isConnected };
  }
}