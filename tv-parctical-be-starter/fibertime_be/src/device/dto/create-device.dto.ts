import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateDeviceDto {
  @ApiProperty({
    example: '00:1A:2B:3C:4D:5E',
    description: 'MAC address of the TV device',
  })
  @IsString()
  @Matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, {
    message: 'Invalid MAC address format',
  })
  macAddress: string;
}
