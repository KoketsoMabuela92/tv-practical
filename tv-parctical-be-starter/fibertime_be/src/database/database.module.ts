import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { PairingCode } from '../device/entities/pairing-code.entity';
import { Bundle } from '../users/entities/bundle.entity';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'fibertime_db',
      entities: [User, PairingCode, Bundle],
      synchronize: true, 
    }),
  ],
})
export class DatabaseModule {}