import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../../users/models/schemas/user.schema';
import { MongooseMiddlewareHelper } from 'src/global/helper/mongoose_middleware.helper';
import { Reservable } from 'src/api/reservable/models/schemas/reservable.schema';
import { ReservationStatus } from '../enums/ReservationStatus.enum';

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

  @Prop({ type: Number, enum: ReservationStatus, default: ReservationStatus.Pending })
  status: ReservationStatus;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: Reservable.name, required: true })
  reservableId: Types.ObjectId | Reservable;

}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

MongooseMiddlewareHelper.setupMappingMiddlewares(ReservationSchema);