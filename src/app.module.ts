import { Logger, Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { MasterModule } from './global/master.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { routes } from './routes';
import { APP_FILTER, APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth/gaurds/auth.guard';
import { RolesGuard } from './auth/gaurds/roles.gaurd';
import AllExceptionsFilter from './global/filters/error.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
   
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let logger = new Logger("Mongoose");
        logger.debug(`connecting to ${configService.get("DATABASEURL")} database ${configService.get("DBNAME")}`)
        return {
          uri: configService.get("DATABASEURL"),
          dbName: configService.get("DBNAME"),
          connectionErrorFactory: (error) => {

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
    AuthModule,
    ApiModule,
    // RouterModule.register(routes),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide:APP_GUARD,
      useClass:RolesGuard
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
  ],
})
export class AppModule { }
