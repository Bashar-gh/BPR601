import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { SideordersService } from './sideorders.service';
import { SideOrderListItem } from './models/types/sideorder_list_item.type';
import { SideOrderDetails } from './models/types/sideorder_details.type';
import { CreateSideOrderDTO } from './models/dtos/create_sideorder.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';
import { JWT_Data } from 'src/auth/types/jwt-data.type';
import { StatusDTO } from 'src/global/models/dtos/status.dto';

@Controller('api/sideorders')
export class SideordersController {

    constructor(private sideOrderService: SideordersService) { }
    @Get("mostPopular")
    async getMostPopular(): Promise<ArrayReturn<SideOrderListItem>> {
        return this.sideOrderService.getMostPopular();
    }
    @Get("details/:id")
    async getDetails(@Param("id") id: string): Promise<SideOrderDetails> {
        return this.sideOrderService.getDetails(id);
    }
    @Roles(Role.Owner, Role.Admin)
    @Get("me")
    async getOwner(@Req() request: any): Promise<ArrayReturn<SideOrderListItem>> {
        let payload: JWT_Data = request.payload;
        return this.sideOrderService.getOwner(payload.userId);
    }
    @Roles(Role.Owner, Role.Admin)
    @Post("")
    async create(@Body() dto: CreateSideOrderDTO, @Req() request: any): Promise<SideOrderDetails> {
        let payload: JWT_Data = request.payload;
        return this.sideOrderService.create(dto, payload.userId);
    }
    @Roles(Role.Admin)
    @Get('')
    async getAll(): Promise<ArrayReturn<SideOrderListItem>> {
        return this.sideOrderService.getAll();
    }
    
    @Roles(Role.Admin)
    @Put(':id')
    async update(@Param("id") id: string, @Body() dto: CreateSideOrderDTO, @Query('ownerId') ownerId?: string): Promise<SideOrderDetails> {
        return this.sideOrderService.update(id, dto, ownerId);
    }
    @Put('changeOwner/:id/:ownerId')
    async changeOwner(@Param("id") id: string, @Param('ownerId') ownerId: string): Promise<SideOrderDetails> {
        return this.sideOrderService.changeOwner(id, ownerId);
    }
}
