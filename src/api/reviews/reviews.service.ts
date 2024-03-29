import { Injectable } from '@nestjs/common';
import { Review, ReviewDocument } from './models/schema/review.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { mapReviewListItem, ReviewListItem } from './models/types/review_list_item.type';
import '../../global/extensions/string.extensions';
import { StatusDTO } from 'src/global/models/dtos/status.dto';
import { CreateReviewDTO } from './models/dtos/create_review.dto';
type ReveiwFor = {
    serviceId?: string,
    sideOrderId?: string,
};
@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private reservableModel: Model<ReviewDocument>) { }

    async create(userId: string, reviewFor: ReveiwFor, dto: CreateReviewDTO): Promise<StatusDTO> {
        let review = new this.reservableModel({
            userId: userId.toObjectID(),
            serviceId: reviewFor.serviceId.toObjectID(),
            sideOrderId: reviewFor.sideOrderId.toObjectID(),
            ...dto
        });
        let saved = await review.save();
        if (!saved) {
            return { Status: false };
        }
        return { Status: true };
    }
    async getServiceReviews(serviceId: string): Promise<ReviewListItem[]> {
        let query = this.reservableModel.find({ serviceId: serviceId.toObjectID() });
        query.populate("userId");
        let data = await query.exec();
        return data.map(mapReviewListItem);
    }
    async getSideOrderReviews(sideOrderId: string): Promise<ReviewListItem[]> {
        let query = this.reservableModel.find({ sideOrderId: sideOrderId.toObjectID() });
        query.populate("userId");
        let data = await query.exec();
        return data.map(mapReviewListItem);
    }

}
