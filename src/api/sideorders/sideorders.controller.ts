import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SideordersService } from './sideorders.service';
import { SideOrderListItem } from './models/types/sideorder_list_item.type';
import { SideOrderDetails } from './models/types/sideorder_details.type';
import { CreateSideOrderDTO } from './models/dtos/create_sideorder.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('api/sideorders')
export class SideordersController {

    constructor(private sideOrderService: SideordersService) { }
    @Get("mostPopular")
    async getMostPopular(): Promise<SideOrderListItem[]> {
        return this.sideOrderService.getMostPopular();
    }
    @Get(":id")
    async getDetails(@Param("id") id: string): Promise<SideOrderDetails> {
        return this.sideOrderService.getDetails(id);
    }
    @Roles(Role.Owner, Role.Admin)
    @Post("")
    async create(@Body() dto: CreateSideOrderDTO): Promise<SideOrderDetails> {
        return this.sideOrderService.create(dto);
    }
}
