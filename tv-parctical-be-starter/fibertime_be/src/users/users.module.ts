import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Bundle } from './entities/bundle.entity';
import { BundleService } from './services/bundle.service';
import { BundleController } from './controllers/bundle.controller';
import { RedisCacheModule } from '../cache/cache.module';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Bundle]),
    RedisCacheModule,
  ],
  providers: [BundleService, UserService],
  controllers: [BundleController, UserController],
  exports: [BundleService, UserService],
})
export class UsersModule {}
