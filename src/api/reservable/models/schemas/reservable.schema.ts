import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MongooseMiddlewareHelper } from 'src/global/helper/mongoose_middleware.helper';
import { ServiceType } from '../enum/service_type.enum';
import { ReviewSum } from 'src/global/models/schema/review_sum.schema';

export type ReservableDocument = Reservable & Document;

@Schema(
  { timestamps: true, }
)
export class Reservable {
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  address: string;
  @Prop()
  description: string;
  @Prop({ type: String, enum: ServiceType, required: true })
  serviceType: ServiceType;
  @Prop({ required: true })
  image: number;
  @Prop({ min: 0, required: true })
  capacity: number;
  @Prop({ min: 0, required: true })
  commission: number;
  @Prop({ type: ReviewSum, required: true })
  reviewSum: ReviewSum;

}

export const ReservableSchema = SchemaFactory.createForClass(Reservable);
MongooseMiddlewareHelper.setupMappingMiddlewares(ReservableSchema);