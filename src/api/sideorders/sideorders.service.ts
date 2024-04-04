import { Injectable } from '@nestjs/common';
import { mapSideOrderItem, SideOrderListItem } from './models/types/sideorder_list_item.type';
import { SideOrder, SideOrderDocument } from './models/schema/sideorder.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { mapSideOrderDetails, SideOrderDetails } from './models/types/sideorder_details.type';
import { CreateSideOrderDTO } from './models/dtos/create_sideorder.dto';
import NotFound from 'src/global/errors/not_found.error';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';
import '../../global/extensions/string.extensions';
import { StatusDTO } from 'src/global/models/dtos/status.dto';
type SideOrderPrice = Pick<SideOrder, 'price' | 'id'>;
@Injectable()
export class SideordersService {

    constructor(@InjectModel(SideOrder.name) private sideOrderModel: Model<SideOrderDocument>) { }
    async create(dto: CreateSideOrderDTO, ownerId: string): Promise<SideOrderDetails> {
        let sideOrder = new this.sideOrderModel({
            ...dto,
            ownerId: ownerId.toObjectID(),
            reviewSum: { avg: 0, count: 0 }
        });
        let saved = await sideOrder.save();
        return mapSideOrderDetails(saved);
    }
    async getMostPopular(): Promise<ArrayReturn<SideOrderListItem>> {
        let topThreeQuery = this.sideOrderModel.find();
        topThreeQuery.sort({ "reviewSum.avg": -1 });
        topThreeQuery.limit(14);
        let topThree = await topThreeQuery.exec();
        return {
            ARRAY: topThree.map(mapSideOrderItem)
        };
    } async updateReviewSum(id: string, avg: number, count: number): Promise<boolean> {
        await this.sideOrderModel.findByIdAndUpdate(id, { reviewSum: { avg: avg, count: count } }).exec();
        return true;
    }
    async getOwner(userId: string): Promise<ArrayReturn<SideOrderListItem>> {
        let topThreeQuery = this.sideOrderModel.find({ ownerId: userId.toObjectID() });
        topThreeQuery.sort({ "reviewSum.avg": -1 });

        let topThree = await topThreeQuery.exec();
        return {
            ARRAY: topThree.map(mapSideOrderItem)
        };
    }
    async getPrices(ids: string[]): Promise<SideOrderPrice[]> {
        let query = this.sideOrderModel.find({ _id: { $in: ids.map((e) => e.toObjectID()) } }).select('price _id');
        let data = await query.exec();
        return data;
    }
    async getDetails(id: string): Promise<SideOrderDetails> {
        let data = await this.sideOrderModel.findById(id).exec();
        if (!data) {
            throw new NotFound(SideOrder);
        }
        return mapSideOrderDetails(data);
    }
    async getAll(): Promise<ArrayReturn<SideOrderListItem>> {
        let topThreeQuery = this.sideOrderModel.find();
        topThreeQuery.sort({ "reviewSum.avg": -1 });

        let topThree = await topThreeQuery.exec();
        return {
            ARRAY: topThree.map(mapSideOrderItem)
        };
    }
    async deleteSideOrder(id: string): Promise<StatusDTO> {
        await this.sideOrderModel.findByIdAndDelete(id).exec();
        return { Status: true };
    }
    async update(id: string, dto: CreateSideOrderDTO, ownerId?: string): Promise<SideOrderDetails> {
        let sideOrder = await this.sideOrderModel.findByIdAndUpdate(id, {
            ...dto,
            ownerId: ownerId?.toObjectID(),
        }, { new: true }).exec();
        if (!sideOrder) {
            throw new NotFound(SideOrder);
        }
        return mapSideOrderDetails(sideOrder);
    }

}

