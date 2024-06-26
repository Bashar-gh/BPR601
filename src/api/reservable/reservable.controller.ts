import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ReservableService } from './reservable.service';
import { ReservableListItem } from './models/types/reservable_list_item';
import { ServiceType } from './models/enum/service_type.enum';
import { ReservableDetails } from './models/types/reservable_details.type';
import { CreateReservableDTO } from './models/dtos/create_reservable.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JWT_Data } from 'src/auth/types/jwt-data.type';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';
import { StatusDTO } from 'src/global/models/dtos/status.dto';

@Controller('api/reservable')
export class ReservableController {

    constructor(private reservableService: ReservableService) { }
    @Get("top")
    async getTopRated(): Promise<ArrayReturn<ReservableListItem>> {
        return this.reservableService.getTopRatedReservables();
    }
    @Get("type")
    async getByType(@Query("type") type?: ServiceType): Promise<ArrayReturn<ReservableListItem>> {
        return this.reservableService.getByType(type);
    }
    @Roles(Role.Owner, Role.Admin)
    @Get("type/me")
    async getByTypeOWner(@Query("type") type: ServiceType, @Req() request: any): Promise<ArrayReturn<ReservableListItem>> {
        let payload: JWT_Data = request.payload;
        return this.reservableService.getByType(type, payload.userId);
    }
    @Get('details/:id')
    async getDetails(@Param("id") id: string): Promise<ReservableDetails> {
        return this.reservableService.getDetails(id);
    }
    @Roles(Role.Owner, Role.Admin)
    @Get('me')
    async getOWner(@Req() request: any): Promise<ArrayReturn<ReservableListItem>> {
        let payload: JWT_Data = request.payload;
        return this.reservableService.getOwner(payload.userId);
    }
    @Roles(Role.Owner, Role.Admin)
    @Post("")
    async create(@Body() dto: CreateReservableDTO, @Req() request: any): Promise<ReservableDetails> {
        let payload: JWT_Data = request.payload;
        return this.reservableService.create(dto, payload.userId);
    }
    
    @Roles(Role.Admin)
    @Get("")
    async getAll(): Promise<ArrayReturn<ReservableListItem>> {
        return this.reservableService.getAll();
    }
    @Roles(Role.Admin)
    @Put(":id")
    async updateService(@Param("id") id: string,@Body() dto: CreateReservableDTO): Promise<ReservableDetails> {
        return this.reservableService.updateService(id, dto);
    }

    @Roles(Role.Admin)
    @Put("changeOwner/:id/:ownerId")
    async changeOwner(@Param("id") id: string,@Param("ownerId") ownerId: string): Promise<ReservableDetails> {
        return this.reservableService.changeOwner(id, ownerId);
    }

}
