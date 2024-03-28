import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserDocument } from '../../../users/models/schemas/user.schema';
import { LocationDocument } from '../../../locations/models/schemas/location.schema';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' })
  status: string;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  userId: UserDocument;

  @Prop({ type: 'ObjectId', ref: 'Location', required: true })
  locationId: LocationDocument;

}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
