import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ([
        {
          ttl: 60, 
          limit: 3, 
          name: 'otp',
        },
        {
          ttl: 60 * 60, 
          limit: 100, 
          name: 'general',
        },
      ]),
    }),
  ],
})
export class ThrottleConfigModule {}
