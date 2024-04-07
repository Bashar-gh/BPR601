import { Injectable } from '@nestjs/common';
import { Favorite, FavoriteDocument } from './models/schemas/favotire.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { StatusDTO } from 'src/global/models/dtos/status.dto';
import '../../global/extensions/string.extensions';
import { mapMyFavorites, MyFavorites } from './models/types/my_favorites.type';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';
import { mapUserListItem, UserListItem } from '../users/models/types/user_list_item.type';
import { User } from '../users/models/schemas/user.schema';

@Injectable()
export class FavoriteService {

    constructor(@InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>) { }
    async makeSideOrderFav(userId: string, sideOrderId: string): Promise<StatusDTO> {
        let fav = new this.favoriteModel({
            userId: userId.toObjectID(),
            sideOrderId: sideOrderId.toObjectID(),
        });
        await fav.save();
        return { Status: true };
    }
    async makeServiceFav(userId: string, serviceId: string): Promise<StatusDTO> {
        let fav = new this.favoriteModel({
            userId: userId.toObjectID(),
            serviceId: serviceId.toObjectID(),
        });
        await fav.save();
        return { Status: true };
    }
    async makeSideOrderNotFav(userId: string, sideOrderId: string): Promise<StatusDTO> {
        let result = await this.favoriteModel.deleteOne({ userId: userId.toObjectID(), sideOrderId: sideOrderId.toObjectID(), });

        return { Status: result.deletedCount == 1 };
    }
    async makeServiceNotFav(userId: string, serviceId: string): Promise<StatusDTO> {
        let result = await this.favoriteModel.deleteOne({ userId: userId.toObjectID(), serviceId: serviceId.toObjectID(), });

        return { Status: result.deletedCount == 1 };
    }
    async getFavorites(userId: string): Promise<MyFavorites> {
        let query = this.favoriteModel.find({ userId: userId.toObjectID() });
        query.populate("serviceId");
        query.populate("sideOrderId");
        let data = await query.exec();
        return mapMyFavorites(data);
    }
    async getUsersFavorited(serviceId?: string, sideOrderId?: string): Promise<ArrayReturn<UserListItem>> {
        let find:any = {};
        if(serviceId){
            find.serviceId =serviceId.toObjectID();
        }
        if(sideOrderId){
            find.sideOrderId =sideOrderId.toObjectID();
        }
        let query = this.favoriteModel.find(find);
        query.populate("userId");
        let data = await query.exec();
        return {
            ARRAY: data.map((e) => mapUserListItem(e.userId as User)),
        };
    }
    async getFavoritesIds(userId: string): Promise<ArrayReturn<string>> {
        let query = this.favoriteModel.find({ userId: userId.toObjectID() }).select('_id');

        let data = await query.exec();
        return {
            ARRAY: data.map((e) => e.id),
        };
    }
}
