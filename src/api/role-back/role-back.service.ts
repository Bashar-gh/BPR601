import { Injectable } from '@nestjs/common';
import { ReservationsService } from '../reservations/reservations.service';
import { ReviewsService } from '../reviews/reviews.service';
import { FavoriteService } from '../favorite/favorite.service';
import { ReservableService } from '../reservable/reservable.service';
import { SideordersService } from '../sideorders/sideorders.service';
import { StatusDTO } from 'src/global/models/dtos/status.dto';

@Injectable()
export class RoleBackService {

    constructor(
        private sideOrderService: SideordersService,
        private reservableService: ReservableService,
        private reservationService: ReservationsService,
        private reviewsService: ReviewsService,
        private favoriteService: FavoriteService,
    ) { }
    async deleteService(id: string): Promise<StatusDTO> {
        await this.reservableService.deleteService(id);
        await this.reservationService.serviceDeleted(id);
        await this.favoriteService.serviceDeleted(id);
        await this.reviewsService.serviceDeleted(id);
        return { Status: true };
    }
    async deleteSideOrder(id: string): Promise<StatusDTO> {
        await this.sideOrderService.deleteSideOrder(id);
        await this.reservationService.sideOrderDeleted(id);
        await this.favoriteService.sideOrderDeleted(id);
        await this.reviewsService.sideOrderDeleted(id);
        return { Status: true };
    }
}
