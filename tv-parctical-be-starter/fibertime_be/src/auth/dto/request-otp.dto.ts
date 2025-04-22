import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RequestOtpDto {
  @ApiProperty({ example: '+27123456789' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  cell_number: string;
}
