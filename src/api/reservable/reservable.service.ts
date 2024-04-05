import { Injectable } from '@nestjs/common';
import { Reservable, ReservableDocument } from './models/schemas/reservable.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceType } from './models/enum/service_type.enum';
import { mapReservableItem, ReservableListItem } from './models/types/reservable_list_item';
import { mapReservableDetails, ReservableDetails } from './models/types/reservable_details.type';
import { CreateReservableDTO } from './models/dtos/create_reservable.dto';
import NotFound from 'src/global/errors/not_found.error';
import '../../global/extensions/string.extensions';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';
import { StatusDTO } from 'src/global/models/dtos/status.dto';

@Injectable()
export class ReservableService {

  constructor(@InjectModel(Reservable.name) private reservableModel: Model<ReservableDocument>) { }

  async create(dto: CreateReservableDTO, ownerId: string): Promise<ReservableDetails> {
    let reservable = new this.reservableModel({
      ...dto,
      ownerId: ownerId.toObjectID(),
      reviewSum: { avg: 0, count: 0 }
    });
    let saved = await reservable.save();
    return mapReservableDetails(saved);
  }
  async getByType(type?: ServiceType, userId?: string): Promise<ArrayReturn<ReservableListItem>> {
    let query = this.reservableModel.find(type==undefined?{}:{ serviceType: type });
    if (userId) {
      query.find({ ownerId: userId.toObjectID() });
    }
    let reservables = await query.exec();
    return {
      ARRAY: reservables.map(mapReservableItem)
    };
  }
  async getOwner(userId: string): Promise<ArrayReturn<ReservableListItem>> {
    let reservables = await this.reservableModel.find({ ownerId: userId.toObjectID() }).exec();

    return {
      ARRAY: reservables.map(mapReservableItem)
    };
  }
  async getPrice(id: string): Promise<number> {
    let reservables = await this.reservableModel.findById(id).select('commission');
    if (!reservables) {
      throw new NotFound(Reservable);
    }
    return reservables.commission;
  }
  async getCapacity(id: string): Promise<number> {
    let reservables = await this.reservableModel.findById(id).select('capacity');
    if (!reservables) {
      throw new NotFound(Reservable);
    }
    return reservables.capacity;
  }
  async updateReviewSum(id: string, avg: number, count: number): Promise<boolean> {
    await this.reservableModel.findByIdAndUpdate(id, { reviewSum: { avg: avg, count: count } }).exec();
    return true;
  }
  async getTopRatedReservables(): Promise<ArrayReturn<ReservableListItem>> {
    let topRatedReservables: ReservableListItem[] = [];
    let type: keyof typeof ServiceType;
    for (type in ServiceType) {
      let topThreeQuery = this.reservableModel.find({ serviceType: ServiceType[type] });
      topThreeQuery.sort({ "reviewSum.avg": 1 });
      topThreeQuery.limit(3);
      let topThree = await topThreeQuery.exec();
      topRatedReservables.push(...topThree.map(mapReservableItem))
    }
    return { ARRAY: topRatedReservables };
  }
  async getDetails(id: string): Promise<ReservableDetails> {
    let data = await this.reservableModel.findById(id);
    if (!data) {
      throw new NotFound(Reservable);
    }
    return mapReservableDetails(data);
  }

  async deleteService(id: String): Promise<StatusDTO> {
    await this.reservableModel.findByIdAndDelete(id);
    return { Status: true };
  }
  async getAll(): Promise<ArrayReturn<ReservableListItem>> {
    let allQuery = this.reservableModel.find();
    allQuery.sort({ "reviewSum.avg": -1 });

    let all = await allQuery.exec();
    return { ARRAY: all.map(mapReservableItem) };
  }
  async updateService(id: string, dto: CreateReservableDTO, ownerId?: string): Promise<ReservableDetails> {
    let reservable = new this.reservableModel({
      ...dto,
      ownerId: ownerId?.toObjectID(),
    });
    let saved = await reservable.save();
    return mapReservableDetails(saved);
  }
}
