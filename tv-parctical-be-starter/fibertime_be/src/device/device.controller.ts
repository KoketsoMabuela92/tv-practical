import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateDeviceCodeDto } from './dto/create-device-code.dto';
import { ConnectDeviceDto } from './dto/connect-device.dto';
import { PairingCode } from './entities/pairing-code.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
@ApiTags('device')
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
  @Post('create-device-code')
  @ApiOperation({
    summary: 'Generate a new device pairing code',
    description: 'Creates a new 4-character pairing code for TV device registration',
  })
  @ApiResponse({
    status: 201,
    description: 'Device code created successfully',
    type: PairingCode,
  })
  @ApiResponse({ status: 400, description: 'Invalid MAC address format' })
  async createDeviceCode(
    @Body() dto: CreateDeviceCodeDto,
  ): Promise<PairingCode> {
    return this.deviceService.createDeviceCode(dto.mac_address);
  }
  @Public()
  @Get(':code')
  @ApiOperation({
    summary: 'Get device by pairing code',
    description: 'Retrieves device information using the pairing code',
  })
  @ApiParam({
    name: 'code',
    description: '4-character device pairing code',
    example: 'ABC1',
  })
  @ApiResponse({
    status: 200,
    description: 'Device found successfully',
    type: PairingCode,
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async getDeviceByCode(@Param('code') code: string): Promise<PairingCode> {
    return this.deviceService.getDeviceByCode(code);
  }
  @Post('connect-device')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Connect device to user',
    description: 'Links a TV device to the authenticated user using the device code',
  })
  @ApiResponse({
    status: 200,
    description: 'Device connected successfully',
    type: PairingCode,
  })
  @ApiResponse({ status: 404, description: 'Device or user not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: ConnectDeviceDto })
  async connectDevice(
    @Body() dto: ConnectDeviceDto,
    @User('id') userId: string,
  ): Promise<PairingCode> {
    return this.deviceService.connectDevice(dto.device_id, userId);
  }
  @Get('connection-status/:deviceCode')
  @ApiOperation({
    summary: 'Get device connection status',
    description: 'Checks if a device is currently connected',
  })
  @ApiParam({
    name: 'deviceCode',
    description: '4-character device pairing code',
    example: 'WJ25',
  })
  @ApiResponse({
    status: 200,
    description: 'Connection status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        isConnected: {
          type: 'boolean',
          example: true,
          description: 'Whether the device is currently connected',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async getConnectionStatus(@Param('deviceCode') deviceCode: string): Promise<{ isConnected: boolean }> {
    return this.deviceService.getConnectionStatus(deviceCode);
  }
}