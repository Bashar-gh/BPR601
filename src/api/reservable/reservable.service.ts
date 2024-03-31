import { Injectable } from '@nestjs/common';
import { Reservable, ReservableDocument } from './models/schemas/reservable.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceType } from './models/enum/service_type.enum';
import { mapReservableItem, ReservableListItem } from './models/types/reservable_list_item';
import { mapReservableDetails, ReservableDetails } from './models/types/reservable_details.type';
import { CreateReservableDTO } from './models/dtos/create_reservable.dto';
import NotFound from 'src/global/errors/not_found.error';

@Injectable()
export class ReservableService {

  constructor(@InjectModel(Reservable.name) private reservableModel: Model<ReservableDocument>) { }

  async create(dto: CreateReservableDTO): Promise<ReservableDetails> {
    let reservable = new this.reservableModel({ ...dto, reviewSum: { avg: 0, count: 0 } });
    let saved = await reservable.save();
    return mapReservableDetails(saved);
  }
  async getByType(type: ServiceType): Promise<ReservableListItem[]> {
    let reservables = await this.reservableModel.find({ serviceType: type }).exec();

    return reservables.map(mapReservableItem);
  }
  async getPrice(id:string): Promise<number> {
    let reservables = await this.reservableModel.findById(id).select('commission');
    if(!reservables){
      throw new NotFound(Reservable);
    }
    return reservables.commission;
  }
  async getCapacity(id:string): Promise<number> {
    let reservables = await this.reservableModel.findById(id).select('capacity');
    if(!reservables){
      throw new NotFound(Reservable);
    }
    return reservables.capacity;
  }
  async getTopRatedReservables(): Promise<ReservableListItem[]> {
    let topRatedReservables: ReservableListItem[] = [];
    for (let type in ServiceType) {
      let topThreeQuery = this.reservableModel.find({ serviceType: type });
      topThreeQuery.sort({ "reviewSum.avg": 1 });
      topThreeQuery.limit(3);
      let topThree = await topThreeQuery.exec();
      topRatedReservables.push(...topThree.map(mapReservableItem))
    }
    return topRatedReservables;
  }
  async getDetails(id: string): Promise<ReservableDetails> {
    let data = await this.reservableModel.findById(id);
    if(!data){
      throw new NotFound(Reservable);
    }
    return mapReservableDetails(data);
  }

}
