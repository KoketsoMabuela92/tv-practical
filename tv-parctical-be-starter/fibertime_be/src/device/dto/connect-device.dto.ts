import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ConnectDeviceDto {
  @ApiProperty({
    example: 'WJ25',
    description: '4-character device pairing code',
  })
  @IsNotEmpty()
  @IsString()
  device_id: string;
}
