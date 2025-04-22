import { IsString, IsNotEmpty, IsNumber, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class CreateBundleDto {
  @ApiProperty({ example: 'Premium 100GB Bundle' })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ example: 100.00, description: 'Data balance in GB' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  data_balance: number;
  @ApiProperty({ example: '2025-12-31T23:59:59Z' })
  @IsDateString()
  expiry_date: Date;
}
