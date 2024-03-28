import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

import { Reservable } from "src/api/reservable/models/schemas/reservable.schema";
import { User } from "src/api/users/models/schemas/user.schema";

export type ReviewDocument = Review & Document;


@Schema(
    { timestamps: true, }
)
export class Review {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: string;

    @Prop({ type: Types.ObjectId, ref: Reservable.name, required: true })
    serviceId: string;

    @Prop({ min: 0, max: 5, required: true })
    rating: number;

    @Prop({ required: true })
    reviewText: string;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);
