import { Injectable } from '@nestjs/common';
import { Review, ReviewDocument } from './models/schema/review.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { mapReviewListItem, ReviewListItem } from './models/types/review_list_item.type';
import '../../global/extensions/string.extensions';
@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private reservableModel: Model<ReviewDocument>) { }
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
