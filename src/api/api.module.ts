import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ReservationsModule } from './reservations/reservations.module';
import { PaymentsModule } from './payments/payments.module';
import { ReservableModule } from './reservable/reservable.module';
import { SideordersModule } from './sideorders/sideorders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoriteModule } from './favorite/favorite.module';
import { RoleBackModule } from './role-back/role-back.module';


@Module({
    imports: [
       
        UsersModule,
        ReservationsModule,
        PaymentsModule,
        ReservableModule,
        SideordersModule,
        ReviewsModule,
        FavoriteModule,
        RoleBackModule,
      
    ],
    
})
export class ApiModule { }