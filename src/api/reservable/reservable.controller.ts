import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReservableService } from './reservable.service';
import { ReservableListItem } from './models/types/reservable_list_item';
import { ServiceType } from './models/enum/service_type.enum';
import { ReservableDetails } from './models/types/reservable_details.type';
import { CreateReservableDTO } from './models/dtos/create_reservable.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

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
    @Roles(Role.Owner, Role.Admin)
    @Post("")
    async create(@Body() dto: CreateReservableDTO): Promise<ReservableDetails> {
        return this.reservableService.create(dto);
    }
}
