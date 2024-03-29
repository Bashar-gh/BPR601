import { Controller, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewListItem } from './models/types/review_list_item.type';

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
}
