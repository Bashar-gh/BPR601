import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewListItem } from './models/types/review_list_item.type';
import { CreateReviewDTO } from './models/dtos/create_review.dto';
import { JWT_Data } from 'src/auth/types/jwt-data.type';
import { StatusDTO } from 'src/global/models/dtos/status.dto';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';

@Controller('api/reviews')
export class ReviewsController {

    constructor(private reviewService: ReviewsService) { }
    @Get("service/:serviceId")
    async getServiceReviews(@Param('serviceId') serviceId: string): Promise<ArrayReturn<ReviewListItem>> {
        let data = await this.reviewService.getServiceReviews(serviceId);
        return { ARRAY: data };
    }
    @Get("order/:sideOrderId")
    async getSideOrderReviews(@Param('sideOrderId') sideOrderId: string): Promise<ArrayReturn<ReviewListItem>> {
        let data = await this.reviewService.getSideOrderReviews(sideOrderId);
        return { ARRAY: data }
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
    @Get("user/:id")
    async getListByUser(@Param('id') userId: string): Promise<ArrayReturn<ReviewListItem>> {
        return this.reviewService.getListByUser(userId);
    }
    @Delete(":id")
    async deleteReview(@Param('id') id: string): Promise<StatusDTO> {
        return this.reviewService.deleteReview(id);
    }
    @Put(":id")
    async editReview(@Param('id') id: string, @Body() dto: CreateReviewDTO): Promise<StatusDTO> {
        return this.reviewService.editReview(id, dto);
    }
}
