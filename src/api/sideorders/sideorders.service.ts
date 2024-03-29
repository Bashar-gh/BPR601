import { Injectable } from '@nestjs/common';
import { mapSideOrderItem, SideOrderListItem } from './models/types/sideorder_list_item.type';
import { SideOrder, SideOrderDocument } from './models/schema/sideorder.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SideOrderType } from './models/enums/sideorder_type.enum';
import { mapSideOrderDetails, SideOrderDetails } from './models/types/sideorder_details.type';

@Injectable()
export class SideordersService {

    constructor(@InjectModel(SideOrder.name) private sideOrderModel: Model<SideOrderDocument>) { }

    async getMostPopular(): Promise<SideOrderListItem[]> {
        let topThreeQuery = this.sideOrderModel.find();
        topThreeQuery.sort({ "reviewSum.avg": 1 });
        topThreeQuery.limit(14);
        let topThree = await topThreeQuery.exec();
        return topThree.map(mapSideOrderItem);
    }
    async getDetails(id: string): Promise<SideOrderDetails> {
        let data = await this.sideOrderModel.findById(id);
        return mapSideOrderDetails(data);
    }

}

