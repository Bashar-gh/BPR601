import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../../users/models/schemas/user.schema';
import { MongooseMiddlewareHelper } from 'src/global/helper/mongoose_middleware.helper';
import { Reservable } from 'src/api/reservable/models/schemas/reservable.schema';
import { ReservationSideOrder } from './reservation_sideorder.schema';

export type ReservationDocument = Reservation & Document;

@Schema(
  { timestamps: true }
)
export class Reservation {
  id: string;
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: true })
  time: number;

  @Prop({ required: true })
  duration: number;
  @Prop({ min: 0, required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: Reservable.name, required: true })
  reservableId: Types.ObjectId | Reservable;
  @Prop({ type: [ReservationSideOrder], required: true })
  sideOrders: ReservationSideOrder[];

}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
ReservationSchema.index({ date: 1, time: 1, reservableId: 1 }, { unique: true });
ReservationSchema.index({ userId: 1, reservableId: 1 }, { unique: true });
MongooseMiddlewareHelper.setupMappingMiddlewares(ReservationSchema);