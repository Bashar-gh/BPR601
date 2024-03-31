import { Injectable } from '@nestjs/common';
import { mapSideOrderItem, SideOrderListItem } from './models/types/sideorder_list_item.type';
import { SideOrder, SideOrderDocument } from './models/schema/sideorder.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { mapSideOrderDetails, SideOrderDetails } from './models/types/sideorder_details.type';
import { CreateSideOrderDTO } from './models/dtos/create_sideorder.dto';
import NotFound from 'src/global/errors/not_found.error';
type SideOrderPrice = Pick<SideOrder, 'price' | 'id'>;
@Injectable()
export class SideordersService {

    constructor(@InjectModel(SideOrder.name) private sideOrderModel: Model<SideOrderDocument>) { }
    async create(dto: CreateSideOrderDTO): Promise<SideOrderDetails> {
        let sideOrder = new this.sideOrderModel({
            ...dto,
            reviewSum: { avg: 0, count: 0 }
        });
        let saved = await sideOrder.save();
        return mapSideOrderDetails(saved);
    }
    async getMostPopular(): Promise<SideOrderListItem[]> {
        let topThreeQuery = this.sideOrderModel.find();
        topThreeQuery.sort({ "reviewSum.avg": 1 });
        topThreeQuery.limit(14);
        let topThree = await topThreeQuery.exec();
        return topThree.map(mapSideOrderItem);
    }
    async getPrices(ids: string[]): Promise<SideOrderPrice[]> {
        let query = this.sideOrderModel.find({ _id: { $in: ids.map((e) => e.toObjectID()) } }).select('price _id');
        let data = await query.exec();
        return data;
    }
    async getDetails(id: string): Promise<SideOrderDetails> {
        let data = await this.sideOrderModel.findById(id);
        if (!data) {
            throw new NotFound(SideOrder);
        }
        return mapSideOrderDetails(data);
    }

}

