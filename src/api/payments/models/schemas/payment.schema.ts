import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Reservation, ReservationDocument } from '../../../reservations/models/schemas/reservation.schema';
import { MongooseMiddlewareHelper } from 'src/global/helper/mongoose_middleware.helper';
import { PaymentMethod } from '../enums/payment_method.enum';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop({ type: Number, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @Prop({ type: Types.ObjectId, ref: Reservation.name, required: true })
  reservationId: Types.ObjectId | Reservation;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

MongooseMiddlewareHelper.setupMappingMiddlewares(PaymentSchema);