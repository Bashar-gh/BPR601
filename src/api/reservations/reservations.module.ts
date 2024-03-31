import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation, ReservationSchema } from './models/schemas/reservation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsModule } from '../payments/payments.module';
import { ReservableModule } from '../reservable/reservable.module';
import { SideordersModule } from '../sideorders/sideorders.module';

@Module({

  imports: [
    MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }]),
    PaymentsModule,
    ReservableModule,
    SideordersModule
  ],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService]
})
export class ReservationsModule { }
