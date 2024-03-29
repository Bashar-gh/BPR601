import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../api/users/users.module';
import { AuthService } from './auth.service';
import { MasterModule } from 'src/global/master.module';

@Module({
  imports: [UsersModule, MasterModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
