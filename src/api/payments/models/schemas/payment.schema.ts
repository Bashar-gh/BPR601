import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ReservationDocument } from '../../../reservations/models/schemas/reservation.schema';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ type: 'ObjectId', ref: 'Reservation', required: true })
  reservationId: ReservationDocument;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
