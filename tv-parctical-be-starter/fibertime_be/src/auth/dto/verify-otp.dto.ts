import { IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class VerifyOtpDto {
  @ApiProperty({ example: '+27123456789' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  cell_number: string;
  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  otp: string;
}
