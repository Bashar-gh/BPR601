import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewListItem } from './models/types/review_list_item.type';
import { CreateReviewDTO } from './models/dtos/create_review.dto';
import { JWT_Data } from 'src/auth/types/jwt-data.type';
import { StatusDTO } from 'src/global/models/dtos/status.dto';

@Controller('reviews')
export class ReviewsController {

    constructor(private reviewService: ReviewsService) { }
    @Get("service/:serviceId")
    async getServiceReviews(@Param('serviceId') serviceId: string): Promise<ReviewListItem[]> {
        return this.reviewService.getServiceReviews(serviceId);
    }
    @Get("sideOrder/:sideOrderId")
    async getSideOrderReviews(@Param('sideOrderId') sideOrderId: string): Promise<ReviewListItem[]> {
        return this.reviewService.getSideOrderReviews(sideOrderId);
    }

    @Post("service/:id")
    async reviewReservable(@Param('id') id: string, @Body() dto: CreateReviewDTO, @Req() request: any): Promise<StatusDTO> {
        let payload: JWT_Data = request.payload;
        return this.reviewService.create(payload.userId, { serviceId: id }, dto);
    }
    @Post("order/:id")
    async reviewOrder(@Param('id') id: string, @Body() dto: CreateReviewDTO, @Req() request: any): Promise<StatusDTO> {
        let payload: JWT_Data = request.payload;
        return this.reviewService.create(payload.userId, { sideOrderId: id }, dto);
    }
}
