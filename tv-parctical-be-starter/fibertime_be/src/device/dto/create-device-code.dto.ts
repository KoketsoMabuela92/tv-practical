import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateDeviceCodeDto {
  @ApiProperty({ description: 'MAC address of the device', example: '00:1B:44:11:3A:B7' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, {
    message: 'Invalid MAC address format. Expected format: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX',
  })
  mac_address: string;
} 