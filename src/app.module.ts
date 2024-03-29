import { Logger, Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { MasterModule } from './global/master.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { routes } from './routes';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RouterModule.register(routes),
    MongooseModule.forRootAsync({
      connectionName: "Main",
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get("DATABASEURL"),
          dbName: configService.get("DBNAME"),
          connectionErrorFactory: (error) => {
            let logger = new Logger("Mongoose");
            logger.error(error.name);
            logger.error(error.message);
            logger.error(error.stack);
            return error;

          }

        };

      },
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (service: ConfigService) => {
        return {
          secret: service.get("JWTSECRET"),
          signOptions: {
            expiresIn: '1d'
          }
        }
      },
    }),
    ApiModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
