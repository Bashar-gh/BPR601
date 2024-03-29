import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../../../auth/enums/role.enum';
import { UserStatus } from '../../enums/user-status.enum';
import { genSaltSync, hashSync } from 'bcrypt';
import { MongooseMiddlewareHelper } from '../../../../global/helper/mongoose_middleware.helper';
import { Gender } from '../../enums/gender.enum';
export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  virtuals: true,

})
export class User {


  id: string;

  @Prop({ unique: true, required: true })
  email: string;


  @Prop({ required: true })
  password: string;

  @Prop({})
  firstName: string;

  @Prop({})
  lastName: string;
  @Prop({})
  otpCode: string;
  @Prop({ type: Number, enum: Gender })
  gender: Gender
  @Prop({ type: Date, })
  dateOfBirth: Date;
  @Prop({ type: String, unique: true, required: true })
  phone: string;

  @Prop({ type: String, enum: Role, default: Role.User })
  type: Role;
  @Prop({ type: String, enum: UserStatus, default: UserStatus.VerifyEmail })
  accountStatus: UserStatus;



}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre("save", function (next) {
  var salts = genSaltSync(1024);
  this.password = hashSync(this.password, salts);
  next();
});
MongooseMiddlewareHelper.setupMappingMiddlewares(UserSchema);