import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation, ReservationSchema } from './models/schemas/reservation.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  
  imports:[MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }])],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports:[ReservationsService]
})
export class ReservationsModule {}
