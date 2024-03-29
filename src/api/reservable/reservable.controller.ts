import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReservableService } from './reservable.service';
import { ReservableListItem } from './models/types/reservable_list_item';
import { ServiceType } from './models/enum/service_type.enum';
import { ReservableDetails } from './models/types/reservable_details.type';

@Controller('reservable')
export class ReservableController {

    constructor(private reservableService: ReservableService) { }
    @Get("top")
    async getTopRated(): Promise<ReservableListItem[]> {
        return this.reservableService.getTopRatedReservables();
    }
    @Get("type")
    async getByType(@Query("type") type: ServiceType): Promise<ReservableListItem[]> {
        return this.reservableService.getByType(type);
    }
    @Get(':id')
    async getDetails(@Param("id") id: string): Promise<ReservableDetails> {
        return this.reservableService.getDetails(id);
    }
}
