import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Reservation, ReservationDocument } from '../../../reservations/models/schemas/reservation.schema';
import { MongooseMiddlewareHelper } from 'src/global/helper/mongoose_middleware.helper';
import { Reservable } from 'src/api/reservable/models/schemas/reservable.schema';
import { SideOrder } from 'src/api/sideorders/models/schema/sideorder.schema';
import { User } from 'src/api/users/models/schemas/user.schema';

export type FavoriteDocument = Favorite & Document;

@Schema({ timestamps: true })
export class Favorite {

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId | User;
  @Prop({ type: Types.ObjectId, ref: Reservable.name })
  serviceId: Types.ObjectId | Reservable;
  @Prop({ type: Types.ObjectId, ref: SideOrder.name })
  sideOrderId: Types.ObjectId | SideOrder;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
FavoriteSchema.index({ userId: 1, serviceId: 1 }, { unique: true });
FavoriteSchema.index({ userId: 1, sideOrderId: 1 }, { unique: true });
// Ensure that either serviceId or sideOrderId has a value, but not both
FavoriteSchema.path('serviceId').validate(function (value) {
  return (value || this.sideOrderId); // Returns false if both serviceId and sideOrderId have values
}, 'Either serviceId or sideOrderId must have a value, not both');

FavoriteSchema.path('sideOrderId').validate(function (value) {
  return (value || this.serviceId); // Returns false if both sideOrderId and serviceId have values
}, 'Either serviceId or sideOrderId must have a value, not both');

MongooseMiddlewareHelper.setupMappingMiddlewares(FavoriteSchema);