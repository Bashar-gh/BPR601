import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MongooseMiddlewareHelper } from 'src/global/helper/mongoose_middleware.helper';
import { ServiceType } from '../enum/service_type.enum';

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
  @Prop({ required: true })
  capacity: number;

}

export const ReservableSchema = SchemaFactory.createForClass(Reservable);
MongooseMiddlewareHelper.setupMappingMiddlewares(ReservableSchema);