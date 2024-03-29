import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import helmet from 'helmet';
async function bootstrap() {
  const logger = new Logger('APP');
  logger.debug("Creating App");
  const app = await NestFactory.create(AppModule);
  logger.debug("App Created");



  

  app.use(helmet());
  logger.debug("Used Helmet");

  app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true, forbidUnknownValues: true, transform: true }));
  logger.debug("Used Validation Pipe");


  app.use(morgan('dev'));
  logger.debug("Used Morgan");







  const port = parseInt(env.PORT || '3000');
  logger.debug(`Trying Port Listen ${port}`);

  
 
  app.listen(port);
  logger.log(`Listening on Port ${port}`);
}
bootstrap();
