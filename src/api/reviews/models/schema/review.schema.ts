import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

import { Reservable } from "src/api/reservable/models/schemas/reservable.schema";
import { SideOrder } from "src/api/sideorders/models/schema/sideorder.schema";
import { User } from "src/api/users/models/schemas/user.schema";
import { MongooseMiddlewareHelper } from "src/global/helper/mongoose_middleware.helper";

export type ReviewDocument = Review & Document;


@Schema(
    { timestamps: true, }
)
export class Review {
    id: string;
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId | User;

    @Prop({ type: Types.ObjectId, ref: Reservable.name })
    serviceId: Types.ObjectId | Reservable;
    @Prop({ type: Types.ObjectId, ref: SideOrder.name })
    sideOrderId: Types.ObjectId | SideOrder;

    @Prop({ min: 0, max: 5, required: true })
    rating: number;
    @Prop({ required: true })
    reviewText: string;
    @Prop({ required: true })
    createdAt: Date;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);
// Ensure that either serviceId or sideOrderId has a value, but not both
ReviewSchema.path('serviceId').validate(function (value) {
    return (value || this.sideOrderId); // Returns false if both serviceId and sideOrderId have values
}, 'Either serviceId or sideOrderId must have a value, not both');

ReviewSchema.path('sideOrderId').validate(function (value) {
    return (value || this.serviceId); // Returns false if both sideOrderId and serviceId have values
}, 'Either serviceId or sideOrderId must have a value, not both');

MongooseMiddlewareHelper.setupMappingMiddlewares(ReviewSchema);