import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MongooseMiddlewareHelper } from 'src/global/helper/mongoose_middleware.helper';
import { SideOrderType } from '../enums/sideorder_type.enum';
import { ReviewSum } from 'src/global/models/types/review_sum.type';

export type SideOrderDocument = SideOrder & Document;

@Schema(
    { timestamps: true, }
)
export class SideOrder {
    id: string;
    @Prop({ required: true })
    name: string;
    @Prop({ type: Number, required: true })
    image: number
    @Prop({ type: String, enum: SideOrderType, required: true })
    orderType: SideOrderType;
    @Prop()
    description: string;
    @Prop({ required: true })
    price: number;
    @Prop({ required: true })
    reviewSum: ReviewSum

}

export const SideOrderSchema = SchemaFactory.createForClass(SideOrder);

MongooseMiddlewareHelper.setupMappingMiddlewares(SideOrderSchema);