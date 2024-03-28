import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { MasterModule } from './global/master.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    ApiModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
