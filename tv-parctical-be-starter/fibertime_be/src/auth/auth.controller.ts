import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpThrottlerGuard } from '../config/throttle/throttle.guard';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('request-otp')
  @UseGuards(OtpThrottlerGuard)
  @ApiOperation({ summary: 'Request OTP for phone number verification' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async requestOTP(@Body() dto: RequestOtpDto) {
    return this.authService.requestOTP(dto.cell_number);
  }
  @Post('login')
  @ApiOperation({ summary: 'Verify OTP and login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async verifyOTP(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOTP(dto.cell_number, dto.otp);
  }
}
