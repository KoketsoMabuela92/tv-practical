import { Module } from '@nestjs/common';
import { RedisConfigModule } from './config/redis/redis.module';
import { ThrottleConfigModule } from './config/throttle/throttle.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { DeviceModule } from './device/device.module';
import { UsersModule } from './users/users.module';
import { RedisCacheModule } from './cache/cache.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RateLimitInterceptor } from './common/interceptors/rate-limit.interceptor';
@Module({
  imports: [
    ThrottleConfigModule,
    RedisConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    AuthModule,
    DeviceModule,
    UsersModule,
    RedisCacheModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
  ],
})
export class AppModule {}
