import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Reservation, ReservationDocument } from '../../../reservations/models/schemas/reservation.schema';
import { MongooseMiddlewareHelper } from 'src/global/helper/mongoose_middleware.helper';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ type: Types.ObjectId, ref: Reservation.name, required: true })
  reservationId: Types.ObjectId | Reservation;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

MongooseMiddlewareHelper.setupMappingMiddlewares(PaymentSchema);