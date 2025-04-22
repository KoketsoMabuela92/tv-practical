import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RateLimiterMemory } from 'rate-limiter-flexible';
@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private otpRateLimiter: RateLimiterMemory;
  private deviceCodeRateLimiter: RateLimiterMemory;
  constructor() {
    this.otpRateLimiter = new RateLimiterMemory({
      points: 3,
      duration: 15 * 60, 
    });
    this.deviceCodeRateLimiter = new RateLimiterMemory({
      points: 5,
      duration: 60 * 60, 
    });
  }
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const path = request.path;
    try {
      if (path.includes('/auth/request-otp')) {
        await this.otpRateLimiter.consume(ip);
      }
      if (path.includes('/device/create-device-code')) {
        await this.deviceCodeRateLimiter.consume(ip);
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Too many requests, please try again later',
      }, HttpStatus.TOO_MANY_REQUESTS);
    }
    return next.handle();
  }
}
