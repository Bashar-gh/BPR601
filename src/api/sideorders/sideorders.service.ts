import { Injectable } from '@nestjs/common';
import { mapSideOrderItem, SideOrderListItem } from './models/types/sideorder_list_item.type';
import { SideOrder, SideOrderDocument } from './models/schema/sideorder.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SideOrderType } from './models/enums/sideorder_type.enum';
import { mapSideOrderDetails, SideOrderDetails } from './models/types/sideorder_details.type';
import { CreateSideOrderDTO } from './models/dtos/create_sideorder.dto';
import NotFound from 'src/global/errors/not_found.error';

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
    async getDetails(id: string): Promise<SideOrderDetails> {
        let data = await this.sideOrderModel.findById(id);
        if(!data){
            throw new NotFound(SideOrder);
        }
        return mapSideOrderDetails(data);
    }

}

