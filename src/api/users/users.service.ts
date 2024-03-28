import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./models/schemas/user.schema";
import { Model } from "mongoose";
import { UserStatus } from "./enums/user-status.enum";
import { genSaltSync, hashSync } from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
  async updateById(id: string, userData: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
  }
  async makeEmailVerified(id: string): Promise<User> {
    return this.updateById(id, { accountStatus: UserStatus.AllGood, otpCode: undefined });
  }

  async setPassword(id: string, password: string): Promise<User> {
    var salts = genSaltSync(1024);
    return this.updateById(id, { password: hashSync(password, salts), otpCode: undefined });
  }

  async findByEmail(email: string): Promise<User[]> {
    return this.userModel.find({ email: email.trim() });
  }
  async create(userDto: User): Promise<User> {
    const newUser = new this.userModel(userDto);
    return newUser.save();
  }



  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

}
