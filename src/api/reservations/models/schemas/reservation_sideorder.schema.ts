import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SideOrder } from 'src/api/sideorders/models/schema/sideorder.schema';

export class ReservationSideOrder {
  @Prop({ type: Types.ObjectId, ref: SideOrder.name, required: true })
  sideOrderId: Types.ObjectId | SideOrder;
  @Prop({ type: Number, min: 0, required: true })
  price: number;
  @Prop({ type: Number, min: 0, required: true })
  count: number;

}
