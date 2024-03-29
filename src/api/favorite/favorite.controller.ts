import { Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { StatusDTO } from 'src/global/models/dtos/status.dto';
import { JWT_Data } from 'src/auth/types/jwt-data.type';
import { MyFavorites } from './models/types/my_favorites.type';

@Controller('favorite')
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
    @Get("me")
    async getFavorites(@Req() request: any): Promise<MyFavorites> {
        let payload: JWT_Data = request.payload;
        return this.favoriteService.getFavorites(payload.userId);
    }
}
