import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./models/schemas/user.schema";
import { Model } from "mongoose";
import { UserStatus } from "./enums/user-status.enum";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
  async makeEmailVerified(id: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, { accountStatus: UserStatus.AllGood }).exec();
  }

  async findByEmail(email: string): Promise<User[]> {
    return this.userModel.find({ email: email.trim() });
  }
  async create(userDto: User): Promise<User> {
    const newUser = new this.userModel(userDto);
    return newUser.save();
  }

  async update(id: string, userDto: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, userDto, { new: true }).exec();
  }

  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

}
