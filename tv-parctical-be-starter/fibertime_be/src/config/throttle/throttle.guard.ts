import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
@Injectable()
export class OtpThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ip; 
  }
  protected getTrackerKey(name: string): string {
    return `otp_${name}`;
  }
}
