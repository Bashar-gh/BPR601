import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../../../auth/enums/role.enum';
import { UserStatus } from '../../enums/user-status.enum';
import * as bcrypt from 'bcrypt';
import { MongooseMiddlewareHelper } from '../../../../global/helper/mongoose_middleware.helper';
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
  @Prop({ type: Date, })
  dateOfBirth: Date;

  @Prop({ type: String, enum: Role, default: Role.User })
  type: Role;
  @Prop({ type: String, enum: UserStatus, default: UserStatus.VerifyEmail })
  accountStatus: UserStatus;

  

}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre("save", function (next) {
  var salts = bcrypt.genSaltSync(1024);
  this.password = bcrypt.hashSync(this.password, salts);
  next();
});
MongooseMiddlewareHelper.setupMappingMiddlewares(UserSchema);