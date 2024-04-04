import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./models/schemas/user.schema";
import { Model } from "mongoose";
import { UserStatus } from "./enums/user-status.enum";
import { genSaltSync, hashSync } from "bcrypt";
import { mapUserDetails, UserDetails } from "./models/types/user_details.type";
import NotFound from "src/global/errors/not_found.error";
import { ArrayReturn } from "src/global/models/dtos/return_type.dto";
import { mapUserListItem, UserListItem } from "./models/types/user_list_item.type";
import { StatusDTO } from "src/global/models/dtos/status.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getDetails(id: string): Promise<UserDetails> {
    let data = await this.findById(id);
    return mapUserDetails(data);

  }
  async disableUser(id: string): Promise<StatusDTO> {
   let data =  await this.userModel.findByIdAndUpdate(id, { accountStatus: UserStatus.Disabled },{new:true});
    return { Status: data?.accountStatus ==   UserStatus.Disabled };

  }
  async getUserList(): Promise<ArrayReturn<UserListItem>> {
    let data = await this.findAll();
    return {
      ARRAY: data.map(mapUserListItem),
    };

  }
  async findById(id: string): Promise<User> {

    let data = await this.userModel.findById(id).exec();
    if (!data) {
      throw new NotFound(User);
    }
    return data;
  }

  async updateById(id: string, userData: Partial<User>): Promise<User> {
    let data = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
    if (!data) {
      throw new NotFound(User);
    }
    return data;
  }
  async makeEmailVerified(id: string): Promise<User> {
    return this.updateById(id, { accountStatus: UserStatus.AllGood, otpCode: "" });
  }

  async setPassword(id: string, password: string): Promise<User> {
    var salts = genSaltSync(1024);
    return this.updateById(id, { password: hashSync(password, salts), otpCode: "" });
  }

  async findByEmail(email: string): Promise<User[]> {
    return this.userModel.find({ email: email.trim() });
  }
  async create(userDto: User): Promise<User> {
    const newUser = new this.userModel(userDto);
    return newUser.save();
  }



  async delete(id: string): Promise<User> {
    let data = await this.userModel.findByIdAndDelete(id).exec();
    if (!data) {
      throw new NotFound(User);
    }
    return data;
  }

}
