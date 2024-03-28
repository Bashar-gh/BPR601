import { Module } from '@nestjs/common';
import { ReservableService } from './reservable.service';
import { ReservableController } from './reservable.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {Reservable, ReservableSchema} from './models/schemas/reservable.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Reservable.name, schema: ReservableSchema }])],
  providers: [ReservableService],
  controllers: [ReservableController],
  exports:[ReservableService]
})
export class ReservableModule {}
