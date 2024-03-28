import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { LocationsController } from './locations/locations.controller';
import { LocationsModule } from './locations/locations.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
    imports: [
        UsersModule,
        LocationsModule,
        ReservationsModule,
        PaymentsModule,
      
    ],
    providers: [],
    exports: [],
    controllers: [],
})
export class ApiModule { }