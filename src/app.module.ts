import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { MasterModule } from './global/master.module';
import { ConfigModule } from '@nestjs/config';
import { routes } from './routes';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    RouterModule.register(routes),
    ApiModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
