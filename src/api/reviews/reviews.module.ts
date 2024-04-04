import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review, ReviewSchema } from './models/schema/review.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservableModule } from '../reservable/reservable.module';
import { SideordersModule } from '../sideorders/sideorders.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ReservableModule,
  SideordersModule,
],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService]
})
export class ReviewsModule { }
