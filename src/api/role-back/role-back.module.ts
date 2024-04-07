import { Module } from '@nestjs/common';
import { RoleBackService } from './role-back.service';
import { RoleBackController } from './role-back.controller';
import { ReservableModule } from '../reservable/reservable.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { SideordersModule } from '../sideorders/sideorders.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { FavoriteModule } from '../favorite/favorite.module';

@Module({
  imports:[
    ReservableModule,
    ReservationsModule,
    SideordersModule,
    ReviewsModule,
    FavoriteModule
  ],
  providers: [RoleBackService],
  controllers: [RoleBackController]
})
export class RoleBackModule {}
