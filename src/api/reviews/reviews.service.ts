import { Injectable } from '@nestjs/common';
import { Review, ReviewDocument } from './models/schema/review.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { mapReviewListItem, ReviewListItem } from './models/types/review_list_item.type';
import '../../global/extensions/string.extensions';
import { StatusDTO } from 'src/global/models/dtos/status.dto';
import { CreateReviewDTO } from './models/dtos/create_review.dto';
import { ReservableService } from '../reservable/reservable.service';
import { SideordersService } from '../sideorders/sideorders.service';
type ReveiwFor = {
    serviceId?: string,
    sideOrderId?: string,
};
@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>, private reservableService: ReservableService, private sideOrdersService: SideordersService) { }

    async create(userId: string, reviewFor: ReveiwFor, dto: CreateReviewDTO): Promise<StatusDTO> {

        let review = new this.reviewModel({
            userId: userId.toObjectID(),
            serviceId: reviewFor.serviceId?.toObjectID(),
            sideOrderId: reviewFor.sideOrderId?.toObjectID(),
            ...dto
        });
        let saved = await review.save();
        if (!saved) {
            return { Status: false };
        }
        let allRelatedReviews = await this.reviewModel.find({
            serviceId: reviewFor.serviceId?.toObjectID(),
            sideOrderId: reviewFor.sideOrderId?.toObjectID(),
        }).exec();
        let total = 0;
        for (let review of allRelatedReviews) {
            total += review.rating;

        }
        if (reviewFor.serviceId) {
            await this.reservableService.updateReviewSum(reviewFor.serviceId, total / allRelatedReviews.length, allRelatedReviews.length);
        }
        if (reviewFor.sideOrderId) {
            await this.sideOrdersService.updateReviewSum(reviewFor.sideOrderId, total / allRelatedReviews.length, allRelatedReviews.length);
        }
       
        return { Status: true };
    }
    async getServiceReviews(serviceId: string): Promise<ReviewListItem[]> {
        let query = this.reviewModel.find({ serviceId: serviceId.toObjectID() });
        query.populate("userId");
        let data = await query.exec();
        return data.map(mapReviewListItem);
    }
    async getSideOrderReviews(sideOrderId: string): Promise<ReviewListItem[]> {
        let query = this.reviewModel.find({ sideOrderId: sideOrderId.toObjectID() });
        query.populate("userId");
        let data = await query.exec();
        return data.map(mapReviewListItem);
    }

}
