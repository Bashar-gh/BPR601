import { Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { StatusDTO } from 'src/global/models/dtos/status.dto';
import { JWT_Data } from 'src/auth/types/jwt-data.type';
import { MyFavorites } from './models/types/my_favorites.type';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';

@Controller('api/favorite')
export class FavoriteController {
    constructor(private favoriteService: FavoriteService) { }
    @Put("fav/sideOrder")
    async makeSideOrderFav(@Query("sideOrderId") sideOrderId: string, @Req() request: any): Promise<StatusDTO> {
        let payload: JWT_Data = request.payload;

        return this.favoriteService.makeSideOrderFav(payload.userId, sideOrderId);
    }
    @Put("fav/service")
    async makeServiceFav(@Query("serviceId") serviceId: string, @Req() request: any): Promise<StatusDTO> {
        let payload: JWT_Data = request.payload;
        return this.favoriteService.makeServiceFav(payload.userId, serviceId);
    }
    @Put("Notfav/sideOrder")
    async makeSideOrderNotFav(@Query("sideOrderId") sideOrderId: string, @Req() request: any): Promise<StatusDTO> {
        let payload: JWT_Data = request.payload;

        return this.favoriteService.makeSideOrderNotFav(payload.userId, sideOrderId);
    }
    @Put("Notfav/service")
    async makeServiceNotFav(@Query("serviceId") serviceId: string,@Req() request: any): Promise<StatusDTO> {
        let payload: JWT_Data = request.payload;
        return this.favoriteService.makeServiceNotFav(payload.userId, serviceId);
    }
    @Get("me")
    async getFavorites(@Req() request: any): Promise<MyFavorites> {
        let payload: JWT_Data = request.payload;
        return this.favoriteService.getFavorites(payload.userId);
    }
    @Get("me/ids")
    async getFavoritesIds(@Req() request: any): Promise<ArrayReturn<string>> {
        let payload: JWT_Data = request.payload;
        return this.favoriteService.getFavoritesIds(payload.userId);
    }
}
